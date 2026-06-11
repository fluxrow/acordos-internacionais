-- Tabela de posts
CREATE TABLE public.blog_posts (
  slug TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  resumo TEXT NOT NULL,
  blocos JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  fontes JSONB NOT NULL DEFAULT '[]'::jsonb,
  leitura_min INTEGER NOT NULL DEFAULT 5,
  autor TEXT NOT NULL DEFAULT 'Dr. Marcos Espínola',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  publicado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_blog_posts_status_pub ON public.blog_posts(status, publicado_em DESC);

-- Tabela de pautas
CREATE TABLE public.blog_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_sugerido TEXT NOT NULL,
  prompt TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  fontes_sugeridas TEXT[] NOT NULL DEFAULT '{}',
  prioridade INTEGER NOT NULL DEFAULT 5,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  usado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_topics TO authenticated;
GRANT ALL ON public.blog_topics TO service_role;

ALTER TABLE public.blog_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage blog topics"
  ON public.blog_topics FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Seeds de pautas
INSERT INTO public.blog_topics (titulo_sugerido, prompt, tags, fontes_sugeridas, prioridade) VALUES
  ('Acordo Brasil–Portugal: como totalizar tempo de contribuição',
   'Explique como funciona a totalização de tempo de contribuição no Acordo Brasil-Portugal: regras, documentação, formulários, prazos, e armadilhas comuns. Cite jurisprudência recente quando relevante.',
   ARRAY['Portugal','Totalização','INSS'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/acordos-internacionais','https://www.seg-social.pt/acordos-internacionais'], 9),
  ('CDSP e DSDP: diferenças, prazos e consequências',
   'Diferencie a Comunicação de Saída Definitiva (CDSP) e a Declaração de Saída Definitiva (DSDP). Prazos, multas, efeito na tributação, e o que acontece se a pessoa não fizer.',
   ARRAY['Saída definitiva','Receita Federal','Imposto de renda'],
   ARRAY['https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dsdp'], 9),
  ('Aposentadoria por idade no exterior: tabela progressiva 2026',
   'Detalhe a tabela progressiva da carência para aposentadoria por idade em 2026 e como aplica para quem mora fora pelo acordo internacional.',
   ARRAY['Aposentadoria','INSS','Carência'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/aposentadoria-por-idade'], 8),
  ('Prova de vida do INSS para quem mora fora do Brasil',
   'Como fazer a prova de vida do INSS no exterior, prazos, documentação consular, e o que mudou recentemente.',
   ARRAY['Prova de vida','INSS','Exterior'],
   ARRAY['https://www.gov.br/inss/pt-br/saiba-mais/prova-de-vida'], 8),
  ('Acordo Brasil-Japão: pontos críticos para nikkeis',
   'Análise das regras do acordo bilateral Brasil-Japão, foco em trabalhadores nikkeis, deslocamento temporário, e cálculo de proporcionalidade.',
   ARRAY['Japão','Nikkei','Bilateral'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/acordos-internacionais/japao','https://www.nenkin.go.jp/'], 7),
  ('Acordo Brasil–EUA: o que muda para brasileiros nos Estados Unidos',
   'Funcionamento do Acordo Brasil-Estados Unidos: totalização, certificate of coverage, social security, e tributação.',
   ARRAY['EUA','Social Security','Bilateral'],
   ARRAY['https://www.ssa.gov/international/Agreement_Pamphlets/brazil.html'], 8),
  ('Contribuição facultativa ao INSS morando no exterior',
   'Vale a pena contribuir como facultativo do INSS morando fora? Códigos, alíquotas, e impacto no cálculo do benefício.',
   ARRAY['Facultativo','INSS','Exterior'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/contribuintes'], 7),
  ('Pensão por morte com acordo internacional: quem tem direito',
   'Regras para pensão por morte quando há acordo internacional envolvido. Dependentes no exterior, documentação, e prazo para requerer.',
   ARRAY['Pensão por morte','Dependentes','Acordo'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/beneficios/pensao-por-morte'], 7),
  ('Acordo Iberoamericano: 13 países, uma só conta',
   'Como funciona o Acordo Multilateral Iberoamericano de Segurança Social, países membros, vantagens e operacionalização.',
   ARRAY['Iberoamericano','Multilateral','OISS'],
   ARRAY['https://oiss.org/convenio-multilateral/','https://www.gov.br/inss/pt-br/assuntos/acordos-internacionais'], 6),
  ('Acordo Brasil–Alemanha: aposentadoria proporcional explicada',
   'Detalhe o cálculo de aposentadoria proporcional no acordo Brasil-Alemanha com exemplos numéricos.',
   ARRAY['Alemanha','Proporcionalidade','Aposentadoria'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/acordos-internacionais/alemanha','https://www.deutsche-rentenversicherung.de/'], 6),
  ('Imposto de renda do brasileiro no exterior em 2026',
   'Atualizações de 2026 sobre tributação de brasileiros no exterior: renda do trabalho, aposentadoria, investimentos.',
   ARRAY['Imposto de renda','Receita Federal','Exterior'],
   ARRAY['https://www.gov.br/receitafederal/pt-br/assuntos/irpf'], 7),
  ('Acordo Brasil–Itália: cidadania não basta',
   'Por que ter cidadania italiana não dá direito automático à aposentadoria italiana. Regras do acordo Brasil-Itália na prática.',
   ARRAY['Itália','Cidadania','Bilateral'],
   ARRAY['https://www.gov.br/inss/pt-br/assuntos/acordos-internacionais/italia','https://www.inps.it/'], 6);