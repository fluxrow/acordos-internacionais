import { useRef, useState } from "react";
import {
  FileUp,
  Calculator,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronDown,
  FileText,
  PenLine,
  CheckCircle,
} from "lucide-react";
import { CTAMarcos } from "@/components/cta-marcos";
import {
  PAISES_ACORDO,
  SMmin,
  calcMesesEntreDatas,
  calcularResultado,
  formatarMoeda,
  formatarTempo,
  type ResultadoCalculo,
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
  mediaSalarial: number;
  totalMeses: number;
}

function isoParaBR(iso: string) {
  // YYYY-MM-DD -> DD/MM/AAAA
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  if (!a || !m || !d) return "";
  return `${d}/${m}/${a}`;
}


export function CalculadoraForm() {
  // Tutorial
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Modo
  const [modo, setModo] = useState<Modo>("cnis");

  // CNIS
  const [carregandoPdf, setCarregandoPdf] = useState(false);
  const [erroPdf, setErroPdf] = useState<string | null>(null);
  const [cnis, setCnis] = useState<CnisInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manual
  const [anosBR, setAnosBR] = useState("");
  const [mesesBR, setMesesBR] = useState("");


  // Dados gerais
  const [dataNascISO, setDataNascISO] = useState("");
  const [sexo, setSexo] = useState<Sexo | "">("");
  const [tipo, setTipo] = useState<TipoBeneficio | "">("");
  const [pais, setPais] = useState<string>("");

  // Exterior
  const [dataInicExtISO, setDataInicExtISO] = useState("");
  const [dataFimExtISO, setDataFimExtISO] = useState("");
  const [mesesPaisManual, setMesesPaisManual] = useState("");

  // Resultado
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [estimativa, setEstimativa] = useState(false);

  async function processarArquivo(file: File) {
    setCarregandoPdf(true);
    setErroPdf(null);
    try {
      const texto = await extrairTextoPdf(file);
      const dados = parsearCNIS(texto);
      setCnis({
        nome: dados.nome ?? "",
        cpf: dados.cpf ?? "",
        mediaSalarial: dados.mediasSalarial ?? 0,
        totalMeses: dados.totalMeses ?? 0,
      });

      if (dados.dataNasc) {
        // DD/MM/AAAA -> YYYY-MM-DD
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

    if (!tipo) {
      setErroForm("Selecione o tipo de benefício que você quer calcular.");
      return;
    }
    if (!pais) {
      setErroForm("Selecione o país onde você trabalhou no exterior.");
      return;
    }
    if (!dataNascISO) {
      setErroForm("Informe sua data de nascimento.");
      return;
    }
    if (!sexo) {
      setErroForm("Selecione o sexo (para regra de idade mínima).");
      return;
    }

    // Salário e tempo no Brasil
    let sbFinal = 0;
    let tempoBrasilMeses = 0;
    let estimativaLocal = false;

    if (modo === "manual") {
      const anos = parseInt(anosBR, 10) || 0;
      const mesesExtra = parseInt(mesesBR, 10) || 0;
      tempoBrasilMeses = anos * 12 + mesesExtra;
      if (tempoBrasilMeses === 0) {
        setErroForm("Informe o tempo contribuído no Brasil (anos e/ou meses).");
        return;
      }
      sbFinal = 0; // sem CNIS, não estimamos valor em reais
      estimativaLocal = true;
    } else {
      if (!cnis || cnis.mediaSalarial <= 0) {
        setErroForm("Envie o extrato do INSS (CNIS) em PDF primeiro — ou use o modo sem extrato.");
        return;
      }
      sbFinal = Math.max(cnis.mediaSalarial, SMmin);
      tempoBrasilMeses = cnis.totalMeses || 0;

    }


    // Tempo no exterior
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

    const r = calcularResultado({
      tempoBrasilMeses,
      tempoPaisMeses,
      sbFinal,
      tipo: tipo as TipoBeneficio,
      nascInput: isoParaBR(dataNascISO),
      sexo: sexo as Sexo,
      nomePais: pais,
    });
    setEstimativa(estimativaLocal);
    setResultado(r);
    // Scroll suave para o resultado
    setTimeout(() => {
      document.getElementById("resultado-calc")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  }

  return (
    <form onSubmit={onCalcular} className="calc-form space-y-8">
      {/* TUTORIAL CNIS */}
      <button
        type="button"
        onClick={() => setTutorialOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-[var(--accent-ink-soft)] bg-[var(--accent-ink-soft)]/40 px-5 py-4 text-left text-sm font-semibold text-[var(--accent-ink)] transition hover:bg-[var(--accent-ink-soft)]/70"
        aria-expanded={tutorialOpen}
      >
        <span>📋 Precisa do seu extrato do INSS (CNIS)? Veja como baixar em 3 passos</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${tutorialOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {tutorialOpen && (
        <div className="-mt-4 space-y-3 rounded-xl border border-border/60 bg-background/70 p-5 text-sm">
          <TutorialStep n={1} titulo="Acesse o site do INSS">
            Entre em{" "}
            <a
              href="https://meu.inss.gov.br"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--accent-ink)] underline underline-offset-2"
            >
              meu.inss.gov.br
            </a>{" "}
            e faça login com sua conta <strong>gov.br</strong>.
          </TutorialStep>
          <TutorialStep n={2} titulo="Encontre o Extrato de Contribuição">
            No menu, clique em <strong>"Extrato de Contribuição"</strong> e depois em{" "}
            <strong>"Relações Previdenciárias"</strong>.
          </TutorialStep>
          <TutorialStep n={3} titulo="Baixe e envie o PDF">
            Clique em <strong>"Emitir PDF"</strong>, salve o arquivo e envie aqui na calculadora.
          </TutorialStep>
        </div>
      )}

      {/* 1️⃣ MODO */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          1️⃣ Como você quer calcular?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ModoCard
            ativo={modo === "cnis"}
            onClick={() => setModo("cnis")}
            icon={<FileText className="h-5 w-5" aria-hidden />}
            titulo="Com extrato do INSS"
            descricao="Resultado mais preciso"
          />
          <ModoCard
            ativo={modo === "manual"}
            onClick={() => setModo("manual")}
            icon={<PenLine className="h-5 w-5" aria-hidden />}
            titulo="Sem extrato (estimativa)"
            descricao="Preencha os dados manualmente"
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
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver
                  ? "border-[var(--accent-ink)] bg-[var(--accent-ink-soft)]/60"
                  : cnis
                  ? "border-[var(--state-success)] bg-[var(--state-success-soft)]/60"
                  : "border-border/70 bg-background/40 hover:bg-[var(--accent-ink-soft)]/30"
              }`}
            >
              {carregandoPdf ? (
                <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-ink)]" aria-hidden />
              ) : cnis ? (
                <CheckCircle className="h-8 w-8 text-[var(--state-success)]" aria-hidden />
              ) : (
                <FileUp className="h-8 w-8 text-muted-foreground" aria-hidden />
              )}
              <p className="mt-3 text-sm font-medium">
                {carregandoPdf
                  ? "Lendo extrato..."
                  : cnis
                  ? `✓ Extrato carregado — ${formatarTempo(cnis.totalMeses)} de contribuição`
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
          <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-5">
            <p className="rounded-md border-l-4 border-[var(--state-info)] bg-[var(--state-info-soft)]/60 px-4 py-3 text-xs text-[var(--state-info)]">
              ℹ️ Sem o extrato do INSS calculamos apenas se você tem <strong>tempo suficiente</strong> para o benefício.
              O <strong>valor em reais</strong> só pode ser estimado com o CNIS.
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

      </section>

      {/* 2️⃣ DADOS */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          2️⃣ Tipo de benefício e seus dados
        </h2>
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
              <SelectTrigger id="sexo"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="M">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tipo">O que você quer calcular?</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBeneficio)}>
              <SelectTrigger id="tipo"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aposentadoria_idade">Aposentadoria por Idade</SelectItem>
                <SelectItem value="pensao_morte">Pensão por Morte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pais">País onde trabalhou no exterior</Label>
            <Select value={pais} onValueChange={setPais}>
              <SelectTrigger id="pais"><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {PAISES_ACORDO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* 3️⃣ EXTERIOR */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          3️⃣ Quanto tempo você trabalhou no exterior?
        </h2>
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
      </section>

      {erroForm && (
        <p className="rounded-md border border-[var(--state-error-soft)] bg-[var(--state-error-soft)] px-4 py-3 text-sm text-[var(--state-error)]">
          {erroForm}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full gap-2 rounded-full md:w-auto">
        <Calculator className="h-4 w-4" aria-hidden />
        🧮 Calcular meu benefício
      </Button>

      {resultado && (
        <div id="resultado-calc">
          <ResultadoView
            resultado={resultado}
            pais={pais}
            tipo={tipo as TipoBeneficio}
            estimativa={estimativa}
          />
        </div>
      )}
    </form>
  );
}

/* ---------- Subcomponentes ---------- */

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
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-ink)] text-xs font-semibold text-[var(--accent-ink-foreground,white)]">
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
      className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition ${
        ativo
          ? "border-[var(--accent-ink)] bg-[var(--accent-ink-soft)]/60"
          : "border-border/60 bg-background/40 hover:border-[var(--accent-ink)]/40"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          ativo
            ? "bg-[var(--accent-ink)] text-[var(--accent-ink-foreground,white)]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="mt-1 text-sm font-semibold">{titulo}</span>
      <span className="text-xs text-muted-foreground">{descricao}</span>
    </button>
  );
}

function ResultadoView({
  resultado,
  pais,
  tipo,
  estimativa,
}: {
  resultado: ResultadoCalculo;
  pais: string;
  tipo: TipoBeneficio;
  estimativa: boolean;
}) {
  const tone = toneFor(resultado.caso);
  const Icon = tone.icon;
  const carencia = tipo === "pensao_morte" ? 18 : 180;

  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        borderColor: `var(${tone.border})`,
        backgroundColor: `var(${tone.bg})`,
      }}
    >
      <header className="flex items-start gap-3">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" style={{ color: `var(${tone.ink})` }} aria-hidden />
        <div>
          <h3 className="text-lg font-semibold leading-tight" style={{ color: `var(${tone.ink})` }}>
            {tituloAmigavel(resultado.caso)}
            {estimativa && (
              <span className="ml-2 inline-block rounded-full bg-[var(--state-warning-soft)] px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-[var(--state-warning)]">
                estimativa
              </span>
            )}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
            {descricaoAmigavel(resultado, pais, carencia)}
          </p>
        </div>
      </header>

      {/* Valor em destaque (caso 3) */}
      {resultado.caso === 3 && resultado.rmiProrata != null && (
        <div
          className="mt-5 rounded-xl border bg-background/70 p-5 text-center"
          style={{ borderColor: `var(${tone.ink})` }}
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Valor estimado do benefício no Brasil
          </div>
          <div className="mt-1 text-3xl font-bold" style={{ color: `var(${tone.ink})` }}>
            {formatarMoeda(resultado.rmiProrata)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            por mês · parte proporcional paga pelo Brasil
          </div>
        </div>
      )}

      {/* Destaque "falta idade" (caso 2B) */}
      {resultado.caso === "2B" && resultado.mesesParaIdade != null && (
        <div
          className="mt-5 rounded-xl border bg-background/70 p-5 text-center"
          style={{ borderColor: `var(${tone.ink})` }}
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Faltam para atingir a idade mínima
          </div>
          <div className="mt-1 text-2xl font-bold" style={{ color: `var(${tone.ink})` }}>
            {formatarTempo(resultado.mesesParaIdade)}
          </div>
        </div>
      )}

      {/* Detalhes resumidos */}
      <dl className="mt-5 grid gap-2 rounded-lg bg-background/60 p-4 text-sm">
        <DetalheLinha label="Tempo no Brasil" valor={formatarTempo(resultado.tempoBrasil)} />
        {resultado.caso !== 1 && (
          <DetalheLinha label={`Tempo no ${pais}`} valor={formatarTempo(resultado.tempoPais)} />
        )}
        {resultado.caso !== 1 && (
          <DetalheLinha label="Total combinado" valor={formatarTempo(resultado.tempoTotal)} />
        )}
        {resultado.caso === 1 && (
          <DetalheLinha label="Carência mínima" valor={formatarTempo(carencia)} />
        )}
        {resultado.caso === 2 && resultado.mesesFaltantes != null && (
          <DetalheLinha
            label="Faltam"
            valor={`⏳ ${formatarTempo(resultado.mesesFaltantes)}`}
            destaque="--state-error"
          />
        )}
        {resultado.caso === 3 && resultado.tempoTotal > 0 && (
          <DetalheLinha
            label="Proporção Brasil"
            valor={`${((resultado.tempoBrasil / resultado.tempoTotal) * 100).toFixed(1)}% do total`}
          />
        )}
      </dl>

      {/* Explicação (caso 3) */}
      {resultado.caso === 3 && resultado.tempoTotal > 0 && (
        <p className="mt-4 rounded-lg bg-background/40 p-4 text-xs leading-relaxed text-foreground/80">
          <strong>Como funciona:</strong> pelo acordo com {pais}, o Brasil paga apenas
          a parte proporcional ao tempo contribuído aqui (
          {((resultado.tempoBrasil / resultado.tempoTotal) * 100).toFixed(1)}%).
          O {pais} paga separadamente a parte deles. Os dois valores juntos compõem
          o benefício total ao qual você tem direito.
          {estimativa && (
            <>
              <br />
              <br />
              <strong>⚠️ Este é um cálculo estimado.</strong> Com o extrato do INSS o resultado seria mais preciso.
            </>
          )}
        </p>
      )}

      <div className="mt-6">
        <CTAMarcos variant="result" caso={resultado.caso} contexto={ctaContexto(resultado.caso)} />
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
    <div className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground" style={destaque ? { color: `var(${destaque})` } : undefined}>
        {label}
      </dt>
      <dd className="font-semibold" style={destaque ? { color: `var(${destaque})` } : undefined}>
        {valor}
      </dd>
    </div>
  );
}

type Tone = {
  ink: string;
  bg: string;
  border: string;
  icon: typeof AlertTriangle;
};

function toneFor(caso: ResultadoCalculo["caso"]): Tone {
  switch (caso) {
    case 1:
      return { ink: "--state-warning", bg: "--state-warning-soft", border: "--state-warning", icon: AlertTriangle };
    case 2:
      return { ink: "--state-error", bg: "--state-error-soft", border: "--state-error", icon: XCircle };
    case "2B":
      return { ink: "--state-info", bg: "--state-info-soft", border: "--state-info", icon: Clock };
    case 3:
      return { ink: "--state-success", bg: "--state-success-soft", border: "--state-success", icon: CheckCircle2 };
  }
}

function tituloAmigavel(caso: ResultadoCalculo["caso"]): string {
  switch (caso) {
    case 1:
      return "⚠️ Você já tem direito no Brasil — sem precisar da totalização";
    case 2:
      return "❌ Ainda não é possível obter este benefício";
    case "2B":
      return "📋 Você tem o tempo — mas ainda não chegou a hora";
    case 3:
      return "✅ Você tem direito à totalização!";
  }
}

function descricaoAmigavel(r: ResultadoCalculo, pais: string, carencia: number): string {
  switch (r.caso) {
    case 1:
      return `Com ${formatarTempo(r.tempoBrasil)} de contribuição no Brasil, você já cumpre o tempo mínimo exigido (${formatarTempo(carencia)}). Não é necessário juntar com o tempo no exterior — fazer isso reduziria o valor do seu benefício.`;
    case 2:
      return `Mesmo somando o tempo no Brasil com o tempo no ${pais}, o total ainda não alcança o mínimo necessário.`;
    case "2B":
      return `Boa notícia: somando seu tempo no Brasil com o ${pais}, você já cumpre o tempo mínimo necessário para o benefício. O que ainda falta é atingir a idade mínima.`;
    case 3:
      return `Somando seu tempo no Brasil com o tempo no ${pais}, você cumpre o tempo mínimo e tem direito ao benefício no Brasil.`;
  }
}

function ctaContexto(caso: ResultadoCalculo["caso"]): string {
  switch (caso) {
    case 1:
      return "Você pode requerer seu benefício diretamente no INSS. O Dr. Marcos Espínola pode te orientar para garantir o melhor valor possível.";
    case 2:
      return "Mesmo sem cumprir a carência hoje, um planejamento previdenciário pode indicar a melhor estratégia — contribuição voluntária, mudança de benefício ou a data ideal de requerimento.";
    case "2B":
      return "Enquanto você aguarda a idade mínima, cada mês contribuído pode aumentar seu benefício futuro. O Dr. Marcos Espínola monta um planejamento personalizado para você chegar na melhor renda possível.";
    case 3:
      return "Você tem direito à totalização internacional. O Dr. Marcos Espínola cuida de todo o processo — do requerimento à concessão — para garantir o melhor resultado.";
  }
}
