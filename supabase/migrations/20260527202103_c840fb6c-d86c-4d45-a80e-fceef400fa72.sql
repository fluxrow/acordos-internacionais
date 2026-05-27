
-- ============================================================
-- Active Sessions
-- ============================================================
CREATE TABLE public.active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  device_label text,
  user_agent text,
  ip_inet inet,
  geo_city text,
  geo_region text,
  geo_country text,
  geo_lat double precision,
  geo_lon double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_id)
);

CREATE INDEX idx_active_sessions_user ON public.active_sessions(user_id, last_seen_at DESC);

GRANT SELECT, DELETE ON public.active_sessions TO authenticated;
GRANT ALL ON public.active_sessions TO service_role;

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active_sessions_select_own" ON public.active_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "active_sessions_delete_own" ON public.active_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- Session Events (log)
-- ============================================================
CREATE TABLE public.session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  device_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('claim','heartbeat','release','expelled','blocked')),
  ip_inet inet,
  geo_city text,
  geo_region text,
  geo_country text,
  geo_lat double precision,
  geo_lon double precision,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_events_user_time ON public.session_events(user_id, occurred_at DESC);

GRANT SELECT ON public.session_events TO authenticated;
GRANT ALL ON public.session_events TO service_role;

ALTER TABLE public.session_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "session_events_select_own" ON public.session_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- Account Risk Flags (admin only)
-- ============================================================
CREATE TABLE public.account_risk_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  score int NOT NULL DEFAULT 0,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid,
  resolution_note text
);

CREATE INDEX idx_risk_flags_open ON public.account_risk_flags(created_at DESC) WHERE resolved_at IS NULL;
CREATE INDEX idx_risk_flags_user ON public.account_risk_flags(user_id, created_at DESC);

GRANT SELECT, UPDATE ON public.account_risk_flags TO authenticated;
GRANT ALL ON public.account_risk_flags TO service_role;

ALTER TABLE public.account_risk_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risk_flags_admin_select" ON public.account_risk_flags
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "risk_flags_admin_update" ON public.account_risk_flags
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- Helpers
-- ============================================================

-- É Pro? (assinatura ativa OU lifetime)
CREATE OR REPLACE FUNCTION public.is_pro(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id
      AND (status = 'active' OR lifetime_access = TRUE)
  );
$$;

-- Distância haversine em km
CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 double precision, lon1 double precision,
  lat2 double precision, lon2 double precision
) RETURNS double precision
LANGUAGE sql IMMUTABLE
AS $$
  SELECT 2 * 6371 * asin(sqrt(
    sin(radians((lat2 - lat1) / 2)) ^ 2 +
    cos(radians(lat1)) * cos(radians(lat2)) *
    sin(radians((lon2 - lon1) / 2)) ^ 2
  ));
$$;

-- ============================================================
-- claim_session: registra dispositivo, bloqueia se já houver outro
-- ============================================================
CREATE OR REPLACE FUNCTION public.claim_session(
  p_device_id text,
  p_device_label text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_ip text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_lat double precision DEFAULT NULL,
  p_lon double precision DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_is_admin boolean;
  v_is_pro boolean;
  v_other record;
  v_ip inet;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;

  BEGIN v_ip := p_ip::inet; EXCEPTION WHEN OTHERS THEN v_ip := NULL; END;

  v_is_admin := public.has_role(v_user, 'admin'::app_role);
  v_is_pro := public.is_pro(v_user);

  -- limpa sessões expiradas (>2min sem heartbeat)
  DELETE FROM public.active_sessions
   WHERE user_id = v_user
     AND last_seen_at < now() - interval '2 minutes';

  -- Pro não-admin: checa se já existe outra sessão
  IF v_is_pro AND NOT v_is_admin THEN
    SELECT * INTO v_other
      FROM public.active_sessions
     WHERE user_id = v_user
       AND device_id <> p_device_id
     ORDER BY last_seen_at DESC
     LIMIT 1;

    IF FOUND THEN
      INSERT INTO public.session_events(user_id, device_id, event_type, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon)
      VALUES (v_user, p_device_id, 'blocked', v_ip, p_city, p_region, p_country, p_lat, p_lon);

      RETURN jsonb_build_object(
        'ok', false,
        'reason', 'taken',
        'other_device_label', COALESCE(v_other.device_label, 'outro dispositivo'),
        'other_city', v_other.geo_city,
        'other_last_seen', v_other.last_seen_at
      );
    END IF;
  END IF;

  -- upsert
  INSERT INTO public.active_sessions(user_id, device_id, device_label, user_agent, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon, last_seen_at)
  VALUES (v_user, p_device_id, p_device_label, p_user_agent, v_ip, p_city, p_region, p_country, p_lat, p_lon, now())
  ON CONFLICT (user_id, device_id) DO UPDATE SET
    device_label = EXCLUDED.device_label,
    user_agent = EXCLUDED.user_agent,
    ip_inet = EXCLUDED.ip_inet,
    geo_city = EXCLUDED.geo_city,
    geo_region = EXCLUDED.geo_region,
    geo_country = EXCLUDED.geo_country,
    geo_lat = EXCLUDED.geo_lat,
    geo_lon = EXCLUDED.geo_lon,
    last_seen_at = now();

  INSERT INTO public.session_events(user_id, device_id, event_type, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon)
  VALUES (v_user, p_device_id, 'claim', v_ip, p_city, p_region, p_country, p_lat, p_lon);

  -- dispara detecção de anomalia (não bloqueante)
  PERFORM public.detect_geo_anomalies(v_user);

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ============================================================
-- heartbeat_session: confirma vivo, retorna ok=false se expulso
-- ============================================================
CREATE OR REPLACE FUNCTION public.heartbeat_session(
  p_device_id text,
  p_ip text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_lat double precision DEFAULT NULL,
  p_lon double precision DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_updated int;
  v_ip inet;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'unauthenticated');
  END IF;

  BEGIN v_ip := p_ip::inet; EXCEPTION WHEN OTHERS THEN v_ip := NULL; END;

  UPDATE public.active_sessions
     SET last_seen_at = now(),
         ip_inet = COALESCE(v_ip, ip_inet),
         geo_city = COALESCE(p_city, geo_city),
         geo_region = COALESCE(p_region, geo_region),
         geo_country = COALESCE(p_country, geo_country),
         geo_lat = COALESCE(p_lat, geo_lat),
         geo_lon = COALESCE(p_lon, geo_lon)
   WHERE user_id = v_user AND device_id = p_device_id;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    INSERT INTO public.session_events(user_id, device_id, event_type, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon)
    VALUES (v_user, p_device_id, 'expelled', v_ip, p_city, p_region, p_country, p_lat, p_lon);
    RETURN jsonb_build_object('ok', false, 'reason', 'expelled');
  END IF;

  INSERT INTO public.session_events(user_id, device_id, event_type, ip_inet, geo_city, geo_region, geo_country, geo_lat, geo_lon)
  VALUES (v_user, p_device_id, 'heartbeat', v_ip, p_city, p_region, p_country, p_lat, p_lon);

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ============================================================
-- release_session
-- ============================================================
CREATE OR REPLACE FUNCTION public.release_session(p_device_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false);
  END IF;

  DELETE FROM public.active_sessions
   WHERE user_id = v_user AND device_id = p_device_id;

  INSERT INTO public.session_events(user_id, device_id, event_type)
  VALUES (v_user, p_device_id, 'release');

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ============================================================
-- release_other_sessions
-- ============================================================
CREATE OR REPLACE FUNCTION public.release_other_sessions(p_device_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_count int;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false);
  END IF;

  WITH del AS (
    DELETE FROM public.active_sessions
     WHERE user_id = v_user AND device_id <> p_device_id
     RETURNING device_id
  )
  SELECT count(*) INTO v_count FROM del;

  RETURN jsonb_build_object('ok', true, 'released', v_count);
END;
$$;

-- ============================================================
-- list_my_devices
-- ============================================================
CREATE OR REPLACE FUNCTION public.list_my_devices()
RETURNS TABLE (
  device_id text,
  device_label text,
  user_agent text,
  geo_city text,
  geo_country text,
  created_at timestamptz,
  last_seen_at timestamptz,
  is_active boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT device_id, device_label, user_agent, geo_city, geo_country, created_at, last_seen_at,
         (last_seen_at > now() - interval '2 minutes') AS is_active
    FROM public.active_sessions
   WHERE user_id = auth.uid()
   ORDER BY last_seen_at DESC;
$$;

-- ============================================================
-- detect_geo_anomalies: registra flag se velocidade impossível
-- ============================================================
CREATE OR REPLACE FUNCTION public.detect_geo_anomalies(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_a record;
  v_b record;
  v_dist double precision;
  v_hours double precision;
BEGIN
  -- pega os 2 eventos mais recentes com geo de device_ids diferentes nas últimas 2h
  SELECT * INTO v_a FROM public.session_events
   WHERE user_id = p_user_id
     AND occurred_at > now() - interval '2 hours'
     AND geo_lat IS NOT NULL AND geo_lon IS NOT NULL
     AND event_type IN ('claim','heartbeat')
   ORDER BY occurred_at DESC LIMIT 1;

  IF v_a IS NULL THEN RETURN; END IF;

  SELECT * INTO v_b FROM public.session_events
   WHERE user_id = p_user_id
     AND occurred_at > now() - interval '2 hours'
     AND geo_lat IS NOT NULL AND geo_lon IS NOT NULL
     AND device_id <> v_a.device_id
     AND event_type IN ('claim','heartbeat')
   ORDER BY occurred_at DESC LIMIT 1;

  IF v_b IS NULL THEN RETURN; END IF;

  v_dist := public.haversine_km(v_a.geo_lat, v_a.geo_lon, v_b.geo_lat, v_b.geo_lon);
  v_hours := EXTRACT(EPOCH FROM (v_a.occurred_at - v_b.occurred_at)) / 3600.0;

  IF v_dist > 800 AND abs(v_hours) < 2 THEN
    -- evita duplicar flag aberta recente
    IF NOT EXISTS (
      SELECT 1 FROM public.account_risk_flags
       WHERE user_id = p_user_id
         AND kind = 'impossible_travel'
         AND resolved_at IS NULL
         AND created_at > now() - interval '6 hours'
    ) THEN
      INSERT INTO public.account_risk_flags(user_id, kind, score, evidence)
      VALUES (
        p_user_id,
        'impossible_travel',
        LEAST(100, (v_dist / 50)::int),
        jsonb_build_object(
          'distance_km', round(v_dist::numeric, 0),
          'hours', round(v_hours::numeric, 2),
          'a', jsonb_build_object('device', v_a.device_id, 'city', v_a.geo_city, 'country', v_a.geo_country, 'at', v_a.occurred_at),
          'b', jsonb_build_object('device', v_b.device_id, 'city', v_b.geo_city, 'country', v_b.geo_country, 'at', v_b.occurred_at)
        )
      );
    END IF;
  END IF;
END;
$$;

-- ============================================================
-- cleanup + cron
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_session_events()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.session_events WHERE occurred_at < now() - interval '30 days';
  DELETE FROM public.active_sessions WHERE last_seen_at < now() - interval '7 days';
$$;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-session-events',
  '0 3 * * *',
  $$ SELECT public.cleanup_old_session_events(); $$
);
