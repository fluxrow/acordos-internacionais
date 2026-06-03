ALTER TABLE public.calc_leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS notas text;

CREATE INDEX IF NOT EXISTS idx_calc_leads_status ON public.calc_leads(status);