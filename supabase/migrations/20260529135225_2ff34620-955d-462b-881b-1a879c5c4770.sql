CREATE TABLE public.hub_laudos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ref TEXT NOT NULL,
  cliente_nome TEXT,
  cliente_cpf TEXT,
  pais TEXT,
  tipo TEXT,
  rmi_valor NUMERIC,
  caso TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_hub_laudos_user_created ON public.hub_laudos(user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hub_laudos TO authenticated;
GRANT ALL ON public.hub_laudos TO service_role;

ALTER TABLE public.hub_laudos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hub_laudos_select_own" ON public.hub_laudos
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "hub_laudos_insert_own" ON public.hub_laudos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hub_laudos_delete_own" ON public.hub_laudos
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);