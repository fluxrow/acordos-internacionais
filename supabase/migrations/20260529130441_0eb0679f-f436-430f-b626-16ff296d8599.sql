CREATE TABLE public.calc_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  pais text,
  tipo text,
  tempo_brasil_meses integer,
  tempo_pais_meses integer,
  data_nasc date,
  sexo text,
  resultado_caso text,
  user_agent text,
  referer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.calc_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calc_leads TO authenticated;
GRANT ALL ON public.calc_leads TO service_role;

ALTER TABLE public.calc_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "calc_leads_insert_public"
ON public.calc_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "calc_leads_admin_select"
ON public.calc_leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "calc_leads_admin_update"
ON public.calc_leads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "calc_leads_admin_delete"
ON public.calc_leads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_calc_leads_created_at ON public.calc_leads (created_at DESC);