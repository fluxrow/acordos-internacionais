import { useRef, useState } from "react";
import {
  FileUp,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronDown,
  FileText,
  PenLine,
  Check,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CTAMarcos } from "@/components/cta-marcos";
import {
  PAISES_ACORDO,
  calcMesesEntreDatas,
  calcularTriagem,
  formatarTempo,
  type ResultadoTriagem,
  type Sexo,
  type TipoBeneficio,
} from "@/lib/calculadora";
import { extrairTextoPdf } from "@/lib/pdfjs-loader";
import { parsearCNIS } from "@/lib/cnis-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Modo = "cnis" | "manual";

interface CnisInfo {
  nome: string;
  cpf: string;
  totalMeses: number;
}

function isoParaBR(iso: string) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  if (!a || !m || !d) return "";
  return `${d}/${m}/${a}`;
}

export function CalculadoraForm() {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [modo, setModo] = useState<Modo>("cnis");

  const [carregandoPdf, setCarregandoPdf] = useState(false);
  const [erroPdf, setErroPdf] = useState<string | null>(null);
  const [cnis, setCnis] = useState<CnisInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [anosBR, setAnosBR] = useState("");
  const [mesesBR, setMesesBR] = useState("");

  const [dataNascISO, setDataNascISO] = useState("");
  const [sexo, setSexo] = useState<Sexo | "">("");
  const [tipo, setTipo] = useState<TipoBeneficio | "">("");
  const [pais, setPais] = useState<string>("");

  const [dataInicExtISO, setDataInicExtISO] = useState("");
  const [dataFimExtISO, setDataFimExtISO] = useState("");
  const [mesesPaisManual, setMesesPaisManual] = useState("");

  const [resultado, setResultado] = useState<ResultadoTriagem | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);

  async function processarArquivo(file: File) {
    setCarregandoPdf(true);
    setErroPdf(null);
    try {
      const texto = await extrairTextoPdf(file);
      const dados = parsearCNIS(texto);
      setCnis({
        nome: dados.nome ?? "",
        cpf: dados.cpf ?? "",
        totalMeses: dados.totalMeses ?? 0,
      });
      if (dados.dataNasc) {
        const [d, m, a] = dados.dataNasc.split("/");
        if (d && m && a && !dataNascISO) setDataNascISO(`${a}-${m}-${d}`);
      }
    } catch (err) {
      setErroPdf("Não foi possível ler este PDF. Tente preencher manualmente.");
      console.error(err);
    } finally {
      setCarregandoPdf(false);
    }
  }

  function onPdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void processarArquivo(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processarArquivo(file);
  }

  function onCalcular(e: React.FormEvent) {
    e.preventDefault();
    setErroForm(null);
    setResultado(null);

    if (!tipo) return setErroForm("Selecione o tipo de benefício que você quer verificar.");
    if (!pais) return setErroForm("Selecione o país onde você trabalhou no exterior.");
    if (!dataNascISO) return setErroForm("Informe sua data de nascimento.");
    if (!sexo) return setErroForm("Selecione o sexo (para regra de idade mínima).");

    let tempoBrasilMeses = 0;
    if (modo === "manual") {
      const anos = parseInt(anosBR, 10) || 0;
      const mesesExtra = parseInt(mesesBR, 10) || 0;
      tempoBrasilMeses = anos * 12 + mesesExtra;
      if (tempoBrasilMeses === 0) {
        setErroForm("Informe o tempo contribuído no Brasil (anos e/ou meses).");
        return;
      }
    } else {
      if (!cnis || cnis.totalMeses <= 0) {
        setErroForm(
          "Não conseguimos ler períodos de contribuição neste PDF. Use o modo 'Sem extrato' e informe o tempo manualmente.",
        );
        return;
      }
      tempoBrasilMeses = cnis.totalMeses;
    }

    let tempoPaisMeses = 0;
    if (mesesPaisManual) {
      tempoPaisMeses = parseInt(mesesPaisManual, 10) || 0;
    } else if (dataInicExtISO && dataFimExtISO) {
      tempoPaisMeses = calcMesesEntreDatas(dataInicExtISO, dataFimExtISO);
    }
    if (tempoPaisMeses <= 0) {
      setErroForm("Informe o período trabalhado no exterior (datas ou total em meses).");
      return;
    }

    const r = calcularTriagem({
      tempoBrasilMeses,
      tempoPaisMeses,
      tipo: tipo as TipoBeneficio,
      nascInput: isoParaBR(dataNascISO),
      sexo: sexo as Sexo,
    });
    setResultado(r);
    setTimeout(() => {
      document.getElementById("resultado-calc")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  }

  return (
    <form onSubmit={onCalcular} className="calc-form space-y-10">
      {/* Tutorial */}
      <div className="rounded-sm border border-border bg-paper-soft/50">
        <button
          type="button"
          onClick={() => setTutorialOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-left text-sm text-foreground/85 transition hover:bg-paper-soft"
          aria-expanded={tutorialOpen}
        >
          <span className="font-medium">
            Precisa do seu extrato do INSS (CNIS)? Veja como baixar em 3 passos.
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${tutorialOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {tutorialOpen && (
          <div className="space-y-3 border-t border-border px-5 py-5 text-sm">
            <TutorialStep n={1} titulo="Acesse o site do INSS">
              Entre em{" "}
              <a
                href="https://meu.inss.gov.br"
                target="_blank"
                rel="noreferrer"
                className="ink-link"
              >
                meu.inss.gov.br
              </a>{" "}
              e faça login com sua conta <strong>gov.br</strong>.
            </TutorialStep>
            <TutorialStep n={2} titulo="Encontre o Extrato de Contribuição">
              No menu, clique em <strong>Extrato de Contribuição</strong> e depois em{" "}
              <strong>Relações Previdenciárias</strong>.
            </TutorialStep>
            <TutorialStep n={3} titulo="Baixe e envie o PDF">
              Clique em <strong>Emitir PDF</strong>, salve o arquivo e envie aqui na calculadora.
            </TutorialStep>
          </div>
        )}
      </div>

      {/* 1. MODO */}
      <Secao numero="01" titulo="Como você quer informar o seu tempo no Brasil?">
        <div className="grid gap-3 sm:grid-cols-2">
          <ModoCard
            ativo={modo === "cnis"}
            onClick={() => setModo("cnis")}
            icon={<FileText className="h-4 w-4" aria-hidden />}
            titulo="Com extrato do INSS"
            descricao="Triagem mais precisa"
          />
          <ModoCard
            ativo={modo === "manual"}
            onClick={() => setModo("manual")}
            icon={<PenLine className="h-4 w-4" aria-hidden />}
            titulo="Sem extrato"
            descricao="Informe o tempo manualmente"
          />
        </div>

        {modo === "cnis" && (
          <div className="space-y-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed p-8 text-center transition ${
                dragOver
                  ? "border-[var(--accent-ink)] bg-paper-soft"
                  : cnis
                  ? "border-[var(--accent-ink)] bg-paper-soft/60"
                  : "border-border bg-background/40 hover:border-foreground/40 hover:bg-paper-soft/40"
              }`}
            >
              {carregandoPdf ? (
                <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-ink)]" aria-hidden />
              ) : cnis ? (
                <Check className="h-6 w-6 text-[var(--accent-ink)]" aria-hidden strokeWidth={1.5} />
              ) : (
                <FileUp className="h-6 w-6 text-muted-foreground" aria-hidden strokeWidth={1.5} />
              )}
              <p className="mt-3 font-serif text-base">
                {carregandoPdf
                  ? "Lendo extrato…"
                  : cnis
                  ? `Extrato carregado — ${formatarTempo(cnis.totalMeses)} de contribuição`
                  : "Clique aqui ou arraste o PDF do CNIS"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {cnis && cnis.nome
                  ? `Segurado: ${cnis.nome}${cnis.cpf ? " · CPF " + cnis.cpf : ""}`
                  : "Arquivo PDF · máximo 20 MB"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={onPdfUpload}
                className="sr-only"
              />
            </div>
            {erroPdf && (
              <p className="text-xs text-[var(--state-error)]">{erroPdf}</p>
            )}
          </div>
        )}

        {modo === "manual" && (
          <div className="space-y-4 rounded-sm border border-border bg-paper-soft/40 p-5">
            <p className="border-l border-[var(--accent-ink)] pl-3 text-xs text-foreground/75">
              Esta é uma triagem para identificar <strong>indícios de direito</strong>. O valor do
              benefício é calculado na análise técnica do advogado.
            </p>
            <div className="space-y-1.5">
              <Label>Tempo contribuído no Brasil</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min={0}
                  value={anosBR}
                  onChange={(e) => setAnosBR(e.target.value)}
                  placeholder="Anos"
                />
                <Input
                  type="number"
                  min={0}
                  max={11}
                  value={mesesBR}
                  onChange={(e) => setMesesBR(e.target.value)}
                  placeholder="Meses"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tempo total que você trabalhou com INSS no Brasil.
              </p>
            </div>
          </div>
        )}
      </Secao>

      {/* 2. DADOS */}
      <Secao numero="02" titulo="Tipo de benefício e seus dados">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nasc">Data de nascimento</Label>
            <Input
              id="nasc"
              type="date"
              value={dataNascISO}
              onChange={(e) => setDataNascISO(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Preenchida automaticamente se você enviou o CNIS.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sexo">Sexo</Label>
            <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
              <SelectTrigger id="sexo"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="M">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tipo">O que você quer verificar?</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBeneficio)}>
              <SelectTrigger id="tipo"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aposentadoria_idade">Aposentadoria por Idade</SelectItem>
                <SelectItem value="pensao_morte">Pensão por Morte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pais">País onde trabalhou no exterior</Label>
            <Select value={pais} onValueChange={setPais}>
              <SelectTrigger id="pais"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {PAISES_ACORDO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Secao>

      {/* 3. EXTERIOR */}
      <Secao numero="03" titulo="Quanto tempo você trabalhou no exterior?">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ext-ini">Data de início no exterior</Label>
            <Input
              id="ext-ini"
              type="date"
              value={dataInicExtISO}
              onChange={(e) => setDataInicExtISO(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ext-fim">Data de fim no exterior</Label>
            <Input
              id="ext-fim"
              type="date"
              value={dataFimExtISO}
              onChange={(e) => setDataFimExtISO(e.target.value)}
            />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">ou, se preferir:</p>
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="ext-meses">Total em meses (se souber)</Label>
          <Input
            id="ext-meses"
            type="number"
            min={0}
            value={mesesPaisManual}
            onChange={(e) => setMesesPaisManual(e.target.value)}
            placeholder="Ex: 51"
          />
        </div>
      </Secao>

      {erroForm && (
        <p className="border-l-2 border-[var(--state-error)] bg-[var(--state-error-soft)]/40 px-4 py-3 text-sm text-[var(--state-error)]">
          {erroForm}
        </p>
      )}

      <Button type="submit" size="lg" className="rounded-sm">
        Verificar meu direito
      </Button>

      {resultado && (
        <div id="resultado-calc">
          <TriagemView resultado={resultado} pais={pais} tipo={tipo as TipoBeneficio} />
        </div>
      )}
    </form>
  );
}

/* ---------- Subcomponentes ---------- */

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <header className="flex items-baseline gap-4 border-b border-border pb-3">
        <span className="eyebrow">{numero}</span>
        <h2 className="font-display text-xl font-semibold tracking-tight">{titulo}</h2>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TutorialStep({
  n,
  titulo,
  children,
}: {
  n: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground text-xs font-semibold">
        {n}
      </div>
      <div className="text-sm leading-relaxed text-foreground/85">
        <strong className="block text-foreground">{titulo}</strong>
        {children}
      </div>
    </div>
  );
}

function ModoCard({
  ativo,
  onClick,
  icon,
  titulo,
  descricao,
}: {
  ativo: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-sm border p-4 text-left transition ${
        ativo
          ? "border-[var(--accent-ink)] bg-paper-soft/70"
          : "border-border bg-background/40 hover:border-foreground/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-sm border ${
          ativo
            ? "border-[var(--accent-ink)] text-[var(--accent-ink)]"
            : "border-border text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-serif text-sm font-semibold">{titulo}</span>
        <span className="text-xs text-muted-foreground">{descricao}</span>
      </span>
    </button>
  );
}

// ─── Resultado da triagem (sem valores monetários) ───────────────────────────

function TriagemView({
  resultado,
  pais,
  tipo,
}: {
  resultado: ResultadoTriagem;
  pais: string;
  tipo: TipoBeneficio;
}) {
  const tone = toneFor(resultado.caso);
  const Icon = tone.icon;

  return (
    <section className="relative rounded-sm border border-border bg-background p-6 md:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-sm"
        style={{ backgroundColor: `var(${tone.ink})` }}
      />
      <p className="eyebrow" style={{ color: `var(${tone.ink})` }}>
        Resultado da triagem
      </p>
      <header className="mt-2 flex items-start gap-3">
        <Icon
          className="mt-1 h-5 w-5 shrink-0"
          style={{ color: `var(${tone.ink})` }}
          strokeWidth={1.5}
          aria-hidden
        />
        <div>
          <h3 className="font-display text-2xl font-semibold leading-tight">
            {resultado.titulo}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-foreground/80">
            {resultado.mensagem}
          </p>
        </div>
      </header>

      <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
        <DetalheLinha label="Tempo no Brasil" valor={formatarTempo(resultado.tempoBrasil)} />
        <DetalheLinha label={`Tempo no ${pais}`} valor={formatarTempo(resultado.tempoPais)} />
        <DetalheLinha label="Total combinado" valor={formatarTempo(resultado.tempoTotal)} />
        <DetalheLinha
          label="Carência mínima"
          valor={`${formatarTempo(resultado.carencia)} (${resultado.carencia} meses)`}
        />
        {tipo === "aposentadoria_idade" && (
          <DetalheLinha
            label="Idade atual / mínima"
            valor={`${resultado.idadeAtual} / ${resultado.idadeMin} anos`}
          />
        )}
        {resultado.mesesFaltantes != null && (
          <DetalheLinha
            label="Faltam de contribuição"
            valor={formatarTempo(resultado.mesesFaltantes)}
            destaque="--state-error"
          />
        )}
        {resultado.mesesParaIdadeMin != null && (
          <DetalheLinha
            label="Faltam para a idade mínima"
            valor={formatarTempo(resultado.mesesParaIdadeMin)}
            destaque="--state-info"
          />
        )}
      </dl>

      {/* CTA — sempre ao final, sem valores monetários */}
      <div className="mt-8 rounded-sm border border-[color-mix(in_oklab,var(--accent-ink)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent-ink)_8%,var(--card-bg))] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
          Próximo passo
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">
          Esta é uma triagem inicial. Para confirmar o direito, calcular o valor estimado e
          preparar o requerimento, fale com o atendimento especializado.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" className="rounded-sm">
            <Link to="/contato">
              Falar com especialista
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-sm">
            <Link to="/contato">Analisar meu caso</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="rounded-sm">
            <Link to="/contato">Quero verificar meu direito</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <CTAMarcos variant="result" caso={mapCasoCta(resultado.caso)} contexto={ctaContexto(resultado.caso)} />
      </div>
    </section>
  );
}

function DetalheLinha({
  label,
  valor,
  destaque,
}: {
  label: string;
  valor: string;
  destaque?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt
        className="text-muted-foreground"
        style={destaque ? { color: `var(${destaque})` } : undefined}
      >
        {label}
      </dt>
      <dd
        className="font-serif font-semibold"
        style={destaque ? { color: `var(${destaque})` } : undefined}
      >
        {valor}
      </dd>
    </div>
  );
}

type Tone = {
  ink: string;
  icon: typeof AlertTriangle;
};

function toneFor(caso: ResultadoTriagem["caso"]): Tone {
  switch (caso) {
    case "BR_SOLO":
      return { ink: "--state-warning", icon: AlertTriangle };
    case "INSUFICIENTE":
      return { ink: "--state-error", icon: XCircle };
    case "AGUARDA_IDADE":
      return { ink: "--state-info", icon: Clock };
    case "TOTALIZACAO_OK":
      return { ink: "--state-success", icon: CheckCircle2 };
  }
}

function mapCasoCta(caso: ResultadoTriagem["caso"]): 1 | 2 | "2B" | 3 {
  switch (caso) {
    case "BR_SOLO": return 1;
    case "INSUFICIENTE": return 2;
    case "AGUARDA_IDADE": return "2B";
    case "TOTALIZACAO_OK": return 3;
  }
}

function ctaContexto(caso: ResultadoTriagem["caso"]): string {
  switch (caso) {
    case "BR_SOLO":
      return "Você pode requerer seu benefício diretamente no INSS. O Dr. Marcos Espínola pode te orientar para garantir o melhor valor possível.";
    case "INSUFICIENTE":
      return "Mesmo sem cumprir a carência hoje, um planejamento previdenciário pode indicar a melhor estratégia — contribuição voluntária, mudança de benefício ou a data ideal de requerimento.";
    case "AGUARDA_IDADE":
      return "Enquanto você aguarda a idade mínima, cada mês contribuído pode aumentar seu benefício futuro. O Dr. Marcos Espínola monta um planejamento personalizado.";
    case "TOTALIZACAO_OK":
      return "Há indícios de direito à totalização internacional. O Dr. Marcos Espínola cuida de todo o processo — do requerimento à concessão.";
  }
}
