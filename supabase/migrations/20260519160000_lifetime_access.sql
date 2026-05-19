-- Migração: suporte a acesso vitalício (programa Fundadores)
-- Não editar diretamente. Alterações futuras via nova migration.

-- Coluna para marcar os 100 primeiros assinantes anuais com acesso vitalício
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS lifetime_access BOOLEAN NOT NULL DEFAULT FALSE;

-- Função pública para contar fundadores sem expor a tabela inteira
-- Usada na página /precos para exibir "X vagas restantes"
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
