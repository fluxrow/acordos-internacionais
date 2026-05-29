
-- Lock down SECURITY DEFINER function execution: revoke from PUBLIC, grant only where needed
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_pro(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_founder_count() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.haversine_km(double precision, double precision, double precision, double precision) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.detect_geo_anomalies(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_session_events() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_session(text, text, text, text, text, text, text, double precision, double precision) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.heartbeat_session(text, text, text, text, text, double precision, double precision) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.release_session(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.release_other_sessions(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_my_devices() FROM PUBLIC, anon;

-- Allow authenticated-only execution where the app calls them
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_pro(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_founder_count() TO anon, authenticated; -- founders count is public marketing info
GRANT EXECUTE ON FUNCTION public.claim_session(text, text, text, text, text, text, text, double precision, double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.heartbeat_session(text, text, text, text, text, double precision, double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.release_session(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.release_other_sessions(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_devices() TO authenticated;

-- Tighten write policies on session/risk tables. Writes flow through SECURITY DEFINER
-- functions (which bypass RLS), so these policies just make intent explicit and block
-- direct PostgREST writes from authenticated clients spoofing other users.

-- account_risk_flags: no client INSERT/DELETE at all (only SECURITY DEFINER writers)
CREATE POLICY risk_flags_no_client_insert ON public.account_risk_flags
  FOR INSERT TO authenticated WITH CHECK (false);

-- active_sessions: clients may only write rows scoped to themselves
CREATE POLICY active_sessions_insert_own ON public.active_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY active_sessions_update_own ON public.active_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- session_events: clients may only insert rows for themselves
CREATE POLICY session_events_insert_own ON public.session_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
