import { useEffect, useRef, useState } from "react";
import { FileUp, Calculator, Printer, AlertTriangle, XCircle, Clock, CheckCircle2 } from "lucide-react";
import {
  PAISES_ACORDO,
  calcularResultado,
  formatarMoeda,
  formatarTempo,
  lerTextoPDF,
  parseadorCNIS,
  carregarPdfJs,
  type CnisData,
  type ResultadoCalculo,
  type Sexo,
  type TipoBeneficio,
} from "@/lib/calculadora";
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

const WHATSAPP_URL = "https://wa.me/55XXXXXXXXXX"; // TODO: substituir pelo número real

type Modo = "pdf" | "manual";

interface CalcFormProps {
  variant: "public" | "pro";
}

interface DadosCliente {
  nomeCliente: string;
  cpfCliente: string;
  dataAnalise: string;
  responsavel: string;
}

export function CalculadoraForm({ variant }: CalcFormProps) {
  // Pré-carrega PDF.js (não bloqueia render)
  useEffect(() => { carregarPdfJs().catch(() => undefined); }, []);

  // ===== estado: dados cliente (apenas pro) =====
  const [cliente, setCliente] = useState<DadosCliente>({
    nomeCliente: "",
    cpfCliente: "",
    dataAnalise: new Date().toISOString().slice(0, 10),
    responsavel: "",
  });

  // ===== estado: brasil =====
  const [modo, setModo] = useState<Modo>("manual");
  const [salarioMedio, setSalarioMedio] = useState<string>("1412");
  const [anosBR, setAnosBR] = useState<string>("");
  const [mesesBR, setMesesBR] = useState<string>("");
  const [cnis, setCnis] = useState<CnisData | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  // ===== estado: dados pessoais =====
  const [dataNasc, setDataNasc] = useState<string>("");
  const [sexo, setSexo] = useState<Sexo>("F");
  const [tipo, setTipo] = useState<TipoBeneficio>("aposentadoria_idade");

  // ===== estado: exterior =====
  const [nomePais, setNomePais] = useState<string>(PAISES_ACORDO[0]);
  const [modoExt, setModoExt] = useState<"datas" | "meses">("meses");
  const [iniExt, setIniExt] = useState<string>("");
  const [fimExt, setFimExt] = useState<string>("");
  const [mesesExt, setMesesExt] = useState<string>("");

  // ===== resultado =====
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erro, setErro] = useState<string>("");

  async function handlePDF(file: File) {
    setPdfStatus("Lendo PDF…");
    try {
      const texto = await lerTextoPDF(file);
      const dados = parseadorCNIS(texto);
      setCnis(dados);
      if (dados.dataNasc) {
        const [d, m, a] = dados.dataNasc.split("/");
        setDataNasc(`${a}-${m}-${d}`);
      }
      if (dados.qtdSalarios > 0) {
        const media = dados.somaSalarios / dados.qtdSalarios;
        setSalarioMedio(media.toFixed(2));
      }
      if (dados.totalMeses > 0) {
        setAnosBR(String(Math.floor(dados.totalMeses / 12)));
        setMesesBR(String(dados.totalMeses % 12));
      }
      setPdfStatus(`PDF lido: ${dados.qtdSalarios} salários, ${dados.vinculos.length} vínculos`);
      if (variant === "pro" && dados.nome) {
        setCliente((c) => ({
          ...c,
          nomeCliente: c.nomeCliente || dados.nome!,
          cpfCliente: c.cpfCliente || (dados.cpf ?? ""),
        }));
      }
    } catch {
      setPdfStatus("Falha ao ler o PDF. Tente o modo manual.");
    }
  }

  function calcular() {
    setErro("");
    setResultado(null);

    let tempoBrasilMeses = 0;
    if (modo === "pdf" && cnis && cnis.totalMeses > 0) {
      tempoBrasilMeses = cnis.totalMeses;
    } else {
      const a = parseInt(anosBR || "0", 10);
      const m = parseInt(mesesBR || "0", 10);
      tempoBrasilMeses = a * 12 + m;
    }

    let tempoPaisMeses = 0;
    if (modoExt === "datas" && iniExt && fimExt) {
      const ini = new Date(iniExt + "T12:00:00");
      const fim = new Date(fimExt + "T12:00:00");
      tempoPaisMeses = Math.max(0, Math.round((fim.getTime() - ini.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
    } else {
      tempoPaisMeses = parseInt(mesesExt || "0", 10);
    }

    const sb = Math.max(1412, parseFloat(salarioMedio || "1412"));

    if (!dataNasc) { setErro("Informe a data de nascimento."); return; }
    if (tempoBrasilMeses === 0 && tempoPaisMeses === 0) {
      setErro("Informe pelo menos um período de contribuição.");
      return;
    }

    setResultado(calcularResultado({
      tempoBrasilMeses, tempoPaisMeses, sbFinal: sb,
      tipo, nascInput: dataNasc, sexo, nomePais,
    }));
  }

  const isPro = variant === "pro";

  return (
    <div className="space-y-12">
      {/* ===== Pro: ficha do cliente ===== */}
      {isPro && (
        <section className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm print:bg-background">
          <p className="eyebrow">Ficha técnica</p>
          <h2 className="mt-2 font-display text-2xl">Dados da análise</h2>
          <hr className="rule mt-3" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nome do cliente">
              <Input value={cliente.nomeCliente} onChange={(e) => setCliente({ ...cliente, nomeCliente: e.target.value })} placeholder="João da Silva" />
            </Field>
            <Field label="CPF">
              <Input value={cliente.cpfCliente} onChange={(e) => setCliente({ ...cliente, cpfCliente: e.target.value })} placeholder="000.000.000-00" />
            </Field>
            <Field label="Data da análise">
              <Input type="date" value={cliente.dataAnalise} onChange={(e) => setCliente({ ...cliente, dataAnalise: e.target.value })} />
            </Field>
            <Field label="Responsável técnico">
              <Input value={cliente.responsavel} onChange={(e) => setCliente({ ...cliente, responsavel: e.target.value })} placeholder="Dr(a). Nome — OAB/UF" />
            </Field>
          </div>
        </section>
      )}

      {/* ===== Seção 1: dados brasileiros ===== */}
      <section className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm print:hidden">
        <p className="eyebrow">01 · Brasil</p>
        <h2 className="mt-2 font-display text-2xl">Contribuições no INSS</h2>
        <hr className="rule mt-3" />

        <div className="mt-6 flex flex-wrap gap-2">
          <ToggleChip ativo={modo === "pdf"} onClick={() => setModo("pdf")}>Com extrato CNIS (PDF)</ToggleChip>
          <ToggleChip ativo={modo === "manual"} onClick={() => setModo("manual")}>Entrada manual</ToggleChip>
        </div>

        {modo === "pdf" ? (
          <div className="mt-6">
            <label
              htmlFor="cnis-pdf"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-[var(--accent-ink)] hover:bg-[var(--accent-ink-soft)]"
            >
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <span className="font-display text-lg">Envie seu CNIS em PDF</span>
              <span className="text-sm text-muted-foreground">
                O arquivo é processado no seu navegador — nada é enviado a servidores.
              </span>
              <input
                ref={inputFileRef}
                id="cnis-pdf"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePDF(f); }}
              />
            </label>
            {pdfStatus && (
              <p className="mt-3 text-sm text-muted-foreground">{pdfStatus}</p>
            )}
            {cnis && (
              <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                <FichaItem rotulo="Nome" valor={cnis.nome ?? "—"} />
                <FichaItem rotulo="CPF" valor={cnis.cpf ?? "—"} />
                <FichaItem rotulo="Tempo total" valor={formatarTempo(cnis.totalMeses)} />
              </dl>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Field label="Salário de benefício médio (R$)">
              <Input type="number" min="1412" step="0.01" value={salarioMedio} onChange={(e) => setSalarioMedio(e.target.value)} />
            </Field>
            <Field label="Anos no Brasil">
              <Input type="number" min="0" value={anosBR} onChange={(e) => setAnosBR(e.target.value)} placeholder="Ex.: 10" />
            </Field>
            <Field label="Meses adicionais">
              <Input type="number" min="0" max="11" value={mesesBR} onChange={(e) => setMesesBR(e.target.value)} placeholder="Ex.: 6" />
            </Field>
          </div>
        )}

        <hr className="rule mt-8" />

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Data de nascimento">
            <Input type="date" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} />
          </Field>
          <Field label="Sexo">
            <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="M">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo de benefício">
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBeneficio)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aposentadoria_idade">Aposentadoria por idade</SelectItem>
                <SelectItem value="pensao_morte">Pensão por morte</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="País do exterior">
            <Select value={nomePais} onValueChange={setNomePais}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAISES_ACORDO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      {/* ===== Seção 2: exterior ===== */}
      <section className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm print:hidden">
        <p className="eyebrow">02 · Exterior</p>
        <h2 className="mt-2 font-display text-2xl">Período em {nomePais}</h2>
        <hr className="rule mt-3" />

        <div className="mt-6 flex flex-wrap gap-2">
          <ToggleChip ativo={modoExt === "meses"} onClick={() => setModoExt("meses")}>Total em meses</ToggleChip>
          <ToggleChip ativo={modoExt === "datas"} onClick={() => setModoExt("datas")}>Datas início / fim</ToggleChip>
        </div>

        {modoExt === "meses" ? (
          <div className="mt-6 max-w-xs">
            <Field label="Total de meses contribuídos no exterior">
              <Input type="number" min="0" value={mesesExt} onChange={(e) => setMesesExt(e.target.value)} placeholder="Ex.: 96" />
            </Field>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-xl">
            <Field label="Início"><Input type="date" value={iniExt} onChange={(e) => setIniExt(e.target.value)} /></Field>
            <Field label="Fim"><Input type="date" value={fimExt} onChange={(e) => setFimExt(e.target.value)} /></Field>
          </div>
        )}
      </section>

      {/* ===== CTA calcular ===== */}
      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <Button onClick={calcular} size="lg" className="gap-2 rounded-full">
          <Calculator className="h-4 w-4" /> Calcular
        </Button>
        {erro && <p className="text-sm text-[var(--state-error)]">{erro}</p>}
      </div>

      {/* ===== Resultado ===== */}
      {resultado && (
        <Resultado resultado={resultado} variant={variant} nomePais={nomePais} cliente={cliente} />
      )}
    </div>
  );
}

// ============================================================
// Subcomponentes
// ============================================================

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">{label}</Label>
      {children}
    </div>
  );
}

function ToggleChip({
  ativo, onClick, children,
}: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors " +
        (ativo
          ? "border-[var(--accent-ink)] bg-[var(--accent-ink)] text-background"
          : "border-border text-foreground hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]")
      }
    >
      {children}
    </button>
  );
}

function FichaItem({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <dt className="eyebrow">{rotulo}</dt>
      <dd className="mt-1 text-sm">{valor}</dd>
    </div>
  );
}

// ====== Cards de resultado por caso ======

type Estado = "warning" | "error" | "info" | "success";

const ESTADO_CLASSES: Record<Estado, { bg: string; border: string; ink: string; Icon: typeof AlertTriangle }> = {
  warning: { bg: "bg-[var(--state-warning-soft)]", border: "border-[var(--state-warning)]", ink: "text-[var(--state-warning)]", Icon: AlertTriangle },
  error:   { bg: "bg-[var(--state-error-soft)]",   border: "border-[var(--state-error)]",   ink: "text-[var(--state-error)]",   Icon: XCircle },
  info:    { bg: "bg-[var(--state-info-soft)]",    border: "border-[var(--state-info)]",    ink: "text-[var(--state-info)]",    Icon: Clock },
  success: { bg: "bg-[var(--state-success-soft)]", border: "border-[var(--state-success)]", ink: "text-[var(--state-success)]", Icon: CheckCircle2 },
};

function CardEstado({
  estado, titulo, children,
}: { estado: Estado; titulo: string; children: React.ReactNode }) {
  const s = ESTADO_CLASSES[estado];
  return (
    <div className={`rounded-xl border-l-4 ${s.border} border-y border-r border-border/60 ${s.bg} p-6`}>
      <div className="flex items-start gap-3">
        <s.Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${s.ink}`} />
        <div className="min-w-0 flex-1">
          <h3 className={`font-display text-xl ${s.ink}`}>{titulo}</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CTAWhatsapp() {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-6 text-center backdrop-blur-sm print:hidden">
      <p className="eyebrow">Próximo passo</p>
      <h3 className="mt-2 font-display text-2xl">Quer dar entrada no benefício?</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Fale com um especialista do escritório do Dr. Marcos Espínola pelo WhatsApp.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Falar pelo WhatsApp
      </a>
    </div>
  );
}

function Resultado({
  resultado, variant, nomePais, cliente,
}: {
  resultado: ResultadoCalculo;
  variant: "public" | "pro";
  nomePais: string;
  cliente: DadosCliente;
}) {
  const isPro = variant === "pro";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="eyebrow">Resultado</p>
        {isPro && (
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </Button>
        )}
      </div>

      {isPro && (
        <div className="hidden print:block">
          <p className="eyebrow">Análise técnica · Acordos Internacionais by AtlasPrev</p>
          <h2 className="mt-2 font-display text-2xl">Parecer de cálculo — totalização internacional</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <FichaItem rotulo="Cliente" valor={cliente.nomeCliente || "—"} />
            <FichaItem rotulo="CPF" valor={cliente.cpfCliente || "—"} />
            <FichaItem rotulo="Data da análise" valor={cliente.dataAnalise} />
            <FichaItem rotulo="Responsável" valor={cliente.responsavel || "—"} />
            <FichaItem rotulo="País do acordo" valor={nomePais} />
          </dl>
        </div>
      )}

      {resultado.caso === 1 && (
        <CardEstado estado="warning" titulo="Você já tem direito no Brasil">
          <p>
            Suas contribuições no Brasil ({formatarTempo(resultado.tempoBrasilMeses)})
            já cumprem a carência de {resultado.carencia} meses. A <strong>totalização é desnecessária</strong> —
            e prejudicial, pois reduziria o benefício pro-rata.
          </p>
          <p>
            RMI estimada (integral): <strong>{formatarMoeda(resultado.rmiIntegral)}</strong>
          </p>
        </CardEstado>
      )}

      {resultado.caso === 2 && (
        <CardEstado estado="error" titulo="Ainda não é possível">
          <p>
            Mesmo somando Brasil ({formatarTempo(resultado.tempoBrasilMeses)}) e
            exterior ({formatarTempo(resultado.tempoPaisMeses)}),
            faltam <strong>{formatarTempo(resultado.faltam)}</strong> para atingir
            a carência de {resultado.carencia} meses.
          </p>
        </CardEstado>
      )}

      {resultado.caso === "2b" && (
        <CardEstado estado="info" titulo="Você tem o tempo, falta a idade">
          <p>
            Carência cumprida via totalização, mas a idade mínima para aposentadoria por idade
            ({resultado.idadeMin} anos) ainda não foi atingida. Hoje você tem <strong>{resultado.idadeAtual} anos</strong>;
            faltam <strong>{formatarTempo(resultado.mesesRestantes)}</strong>.
          </p>
          <p>
            Projeção da RMI pro-rata na elegibilidade: <strong>{formatarMoeda(resultado.rmiProrataProjetada)}</strong>
            {" "}({(resultado.indiceProrrata * 100).toFixed(2)}% da RMI teórica).
          </p>
        </CardEstado>
      )}

      {resultado.caso === 3 && (
        <>
          <CardEstado
            estado="success"
            titulo={`Direito por totalização — Brasil ↔ ${nomePais}`}
          >
            <div className="mt-2">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">RMI estimada (pro-rata)</p>
              <p className="mt-1 font-display text-4xl md:text-5xl">
                {formatarMoeda(resultado.rmiProrrata)}
              </p>
              <p className="mt-2 text-sm">
                {(resultado.indiceProrrata * 100).toFixed(2)}% da RMI teórica de {formatarMoeda(resultado.rmiTeorica)}
              </p>
            </div>
          </CardEstado>

          {isPro && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm print:bg-background">
                <p className="eyebrow">Tabela técnica</p>
                <h3 className="mt-2 font-display text-xl">Parâmetros do cálculo</h3>
                <hr className="rule mt-3" />
                <table className="mt-4 w-full text-sm">
                  <tbody className="divide-y divide-border/60">
                    <Linha rotulo="Tempo Brasil" valor={formatarTempo(resultado.tempoBrasilMeses)} />
                    <Linha rotulo={`Tempo ${nomePais}`} valor={formatarTempo(resultado.tempoPaisMeses)} />
                    <Linha rotulo="Tempo total" valor={formatarTempo(resultado.tempoTotal)} />
                    <Linha rotulo="Carência exigida" valor={`${resultado.carencia} meses`} />
                    <Linha rotulo="Salário de benefício (SB)" valor={formatarMoeda(resultado.sbFinal)} />
                    <Linha rotulo="Coeficiente" valor={`${(resultado.coef * 100).toFixed(0)}%`} />
                    <Linha rotulo="RMI teórica" valor={formatarMoeda(resultado.rmiTeorica)} />
                    <Linha rotulo="Índice pro-rata" valor={`${(resultado.indiceProrrata * 100).toFixed(4)}%`} />
                    <Linha rotulo="RMI pro-rata final" valor={formatarMoeda(resultado.rmiProrrata)} destaque />
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-border/60 bg-secondary/40 p-6 print:bg-background">
                <p className="eyebrow">Fórmula e fundamento</p>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
{`RMI teórica  = SB × coef = ${formatarMoeda(resultado.sbFinal)} × ${(resultado.coef * 100).toFixed(0)}% = ${formatarMoeda(resultado.rmiTeorica)}
Índice prorr = meses_BR ÷ total = ${resultado.tempoBrasilMeses} ÷ ${resultado.tempoTotal} = ${(resultado.indiceProrrata * 100).toFixed(4)}%
RMI pro-rata = ${formatarMoeda(resultado.rmiTeorica)} × ${(resultado.indiceProrrata * 100).toFixed(4)}% = ${formatarMoeda(resultado.rmiProrrata)}

Fundamento: art. 4º do Decreto 3.048/99 c/c acordos bilaterais de previdência social.`}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      {!isPro && <CTAWhatsapp />}
    </section>
  );
}

function Linha({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <tr className={destaque ? "font-display" : ""}>
      <td className="py-2 pr-4 text-muted-foreground">{rotulo}</td>
      <td className={"py-2 text-right " + (destaque ? "text-base text-[var(--accent-ink)]" : "")}>{valor}</td>
    </tr>
  );
}
