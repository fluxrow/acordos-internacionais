-- Histórico de cálculos da calculadora RMI
CREATE TABLE public.calc_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pais TEXT NOT NULL,
  tipo TEXT NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  resultado JSONB NOT NULL DEFAULT '{}'::jsonb,
  rotulo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calc_history ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_calc_history_user_created ON public.calc_history(user_id, created_at DESC);

CREATE POLICY "calc_history_select_own" ON public.calc_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calc_history_insert_own" ON public.calc_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calc_history_update_own" ON public.calc_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "calc_history_delete_own" ON public.calc_history
  FOR DELETE USING (auth.uid() = user_id);

-- Favoritos por país
CREATE TABLE public.hub_favoritos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pais TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pais)
);
ALTER TABLE public.hub_favoritos ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_hub_favoritos_user ON public.hub_favoritos(user_id);

CREATE POLICY "hub_favoritos_select_own" ON public.hub_favoritos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "hub_favoritos_insert_own" ON public.hub_favoritos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hub_favoritos_delete_own" ON public.hub_favoritos
  FOR DELETE USING (auth.uid() = user_id);

-- Anotações por país (uma por user+país)
CREATE TABLE public.hub_notas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pais TEXT NOT NULL,
  conteudo TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, pais)
);
ALTER TABLE public.hub_notas ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_hub_notas_user ON public.hub_notas(user_id);

CREATE POLICY "hub_notas_select_own" ON public.hub_notas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "hub_notas_insert_own" ON public.hub_notas
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hub_notas_update_own" ON public.hub_notas
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "hub_notas_delete_own" ON public.hub_notas
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER hub_notas_set_updated_at
  BEFORE UPDATE ON public.hub_notas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();