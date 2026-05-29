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
} from "lucide-react";
import { CTAMarcos } from "@/components/cta-marcos";
import { CenariosBlock } from "@/components/calculadora/cenarios-block";
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

    if (!tipo) return setErroForm("Selecione o tipo de benefício que você quer calcular.");
    if (!pais) return setErroForm("Selecione o país onde você trabalhou no exterior.");
    if (!dataNascISO) return setErroForm("Informe sua data de nascimento.");
    if (!sexo) return setErroForm("Selecione o sexo (para regra de idade mínima).");

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
      sbFinal = 0;
      estimativaLocal = true;
    } else {
      if (!cnis || cnis.totalMeses <= 0) {
        setErroForm(
          "Não conseguimos ler períodos de contribuição neste PDF. Use o modo 'Sem extrato' e informe o tempo manualmente.",
        );
        return;
      }
      sbFinal = cnis.mediaSalarial > 0 ? Math.max(cnis.mediaSalarial, SMmin) : 0;
      tempoBrasilMeses = cnis.totalMeses;
      estimativaLocal = cnis.mediaSalarial <= 0;
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
      <Secao numero="01" titulo="Como você quer calcular?">
        <div className="grid gap-3 sm:grid-cols-2">
          <ModoCard
            ativo={modo === "cnis"}
            onClick={() => setModo("cnis")}
            icon={<FileText className="h-4 w-4" aria-hidden />}
            titulo="Com extrato do INSS"
            descricao="Resultado mais preciso"
          />
          <ModoCard
            ativo={modo === "manual"}
            onClick={() => setModo("manual")}
            icon={<PenLine className="h-4 w-4" aria-hidden />}
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
              Sem o extrato do INSS calculamos apenas se você tem <strong>tempo suficiente</strong>{" "}
              para o benefício. O <strong>valor em reais</strong> só pode ser estimado com o CNIS.
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
            <Label htmlFor="tipo">O que você quer calcular?</Label>
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
        Calcular benefício
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
      className="relative rounded-sm border border-border bg-background p-6 md:p-8"
    >
      {/* Filete colorido no topo, identificando o caso */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-sm"
        style={{ backgroundColor: `var(${tone.ink})` }}
      />
      <p className="eyebrow" style={{ color: `var(${tone.ink})` }}>
        Resultado
        {estimativa && <span className="ml-2 text-muted-foreground">· estimativa</span>}
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
            {tituloAmigavel(resultado.caso)}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-foreground/80">
            {descricaoAmigavel(resultado, pais, carencia)}
          </p>
        </div>
      </header>

      {resultado.caso === 3 && resultado.rmiProrata != null && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="eyebrow">Valor estimado do benefício no Brasil</p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {formatarMoeda(resultado.rmiProrata)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            por mês · parte proporcional paga pelo Brasil
          </p>
        </div>
      )}

      {resultado.caso === "2B" && resultado.mesesParaIdade != null && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="eyebrow">Faltam para atingir a idade mínima</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {formatarTempo(resultado.mesesParaIdade)}
          </p>
        </div>
      )}

      <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
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
            valor={formatarTempo(resultado.mesesFaltantes)}
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

      {resultado.caso === 3 && resultado.tempoTotal > 0 && (
        <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-foreground/75">
          <strong className="font-semibold text-foreground">Como funciona:</strong> pelo acordo com{" "}
          {pais}, o Brasil paga apenas a parte proporcional ao tempo contribuído aqui (
          {((resultado.tempoBrasil / resultado.tempoTotal) * 100).toFixed(1)}%). O {pais} paga
          separadamente a parte deles. Os dois valores juntos compõem o benefício total ao qual
          você tem direito.
          {estimativa && (
            <>
              <br />
              <br />
              <strong className="font-semibold text-foreground">
                Este é um cálculo estimado.
              </strong>{" "}
              Com o extrato do INSS o resultado seria mais preciso.
            </>
          )}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6">
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
      return "Você já tem direito no Brasil — sem precisar da totalização";
    case 2:
      return "Ainda não é possível obter este benefício";
    case "2B":
      return "Você tem o tempo — mas ainda não chegou a hora";
    case 3:
      return "Você tem direito à totalização";
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
