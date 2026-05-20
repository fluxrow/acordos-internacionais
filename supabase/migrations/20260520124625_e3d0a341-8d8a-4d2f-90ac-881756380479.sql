-- Migração: suporte a acesso vitalício (programa Fundadores)

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS lifetime_access BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.get_founder_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.subscriptions
  WHERE lifetime_access = TRUE;
$$;

GRANT EXECUTE ON FUNCTION public.get_founder_count() TO anon, authenticated;

-- Bucket privado para documentos do hub
INSERT INTO storage.buckets (id, name, public)
VALUES ('hub-docs', 'hub-docs', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: apenas usuários autenticados com assinatura ativa OU lifetime podem ler
CREATE POLICY "hub_docs_read_subscribers"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'hub-docs'
  AND EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
      AND (status = 'active' OR lifetime_access = TRUE)
  )
);

-- Apenas service_role escreve (uploads via server function admin)
CREATE POLICY "hub_docs_service_write"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hub-docs')
WITH CHECK (bucket_id = 'hub-docs');