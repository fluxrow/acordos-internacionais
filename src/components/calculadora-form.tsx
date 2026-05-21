import { useState } from "react";
import { FileUp, Calculator, AlertTriangle, XCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import {
  PAISES_ACORDO,
  CARENCIAS,
  COEFICIENTES,
  SMmin,
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

type Modo = "pdf" | "manual";

interface ProInfo {
  nomeCliente: string;
  cpfCliente: string;
  processo: string;
}

interface Props {
  variant: "public" | "pro";
}

const formatarCpf = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export function CalculadoraForm({ variant }: Props) {
  const isPro = variant === "pro";

  const [modo, setModo] = useState<Modo>("pdf");
  const [carregandoPdf, setCarregandoPdf] = useState(false);
  const [erroPdf, setErroPdf] = useState<string | null>(null);

  const [pro, setPro] = useState<ProInfo>({ nomeCliente: "", cpfCliente: "", processo: "" });

  const [nome, setNome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [sexo, setSexo] = useState<Sexo>("F");
  const [tempoBrasil, setTempoBrasil] = useState<string>("");
  const [pais, setPais] = useState<string>("");
  const [tipo, setTipo] = useState<TipoBeneficio>("aposentadoria_idade");
  const [tempoPais, setTempoPais] = useState<string>("");
  const [salarioMedio, setSalarioMedio] = useState<string>("");

  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);

  async function onPdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCarregandoPdf(true);
    setErroPdf(null);
    try {
      const texto = await extrairTextoPdf(file);
      const dados = parsearCNIS(texto);
      if (dados.nome) setNome(dados.nome);
      if (dados.dataNasc) setDataNasc(dados.dataNasc);
      if (dados.totalMeses > 0) setTempoBrasil(String(dados.totalMeses));
      if (dados.mediasSalarial > 0) setSalarioMedio(dados.mediasSalarial.toFixed(2));
      if (isPro) {
        setPro((p) => ({
          ...p,
          nomeCliente: p.nomeCliente || dados.nome,
          cpfCliente: p.cpfCliente || dados.cpf,
        }));
      }
    } catch (err) {
      setErroPdf("Não foi possível ler este PDF. Tente preencher manualmente.");
      console.error(err);
    } finally {
      setCarregandoPdf(false);
    }
  }

  function onCalcular(e: React.FormEvent) {
    e.preventDefault();
    setErroForm(null);
    setResultado(null);

    if (!dataNasc.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      setErroForm("Informe a data de nascimento no formato DD/MM/AAAA.");
      return;
    }
    const tb = parseInt(tempoBrasil, 10);
    const tp = parseInt(tempoPais, 10);
    const sb = parseFloat(salarioMedio.replace(",", "."));
    if (!pais) {
      setErroForm("Selecione o país do acordo.");
      return;
    }
    if (Number.isNaN(tb) || tb < 0) {
      setErroForm("Informe o tempo de contribuição no Brasil (em meses).");
      return;
    }
    if (Number.isNaN(tp) || tp < 0) {
      setErroForm("Informe o tempo de contribuição no exterior (em meses).");
      return;
    }
    if (Number.isNaN(sb) || sb <= 0) {
      setErroForm("Informe o salário médio de contribuição (R$).");
      return;
    }

    const r = calcularResultado({
      tempoBrasilMeses: tb,
      tempoPaisMeses: tp,
      sbFinal: sb,
      tipo,
      nascInput: dataNasc,
      sexo,
      nomePais: pais,
    });
    setResultado(r);
  }

  return (
    <form onSubmit={onCalcular} className="space-y-10">
      {isPro && (
        <section className="rounded-xl border border-border/60 bg-background/70 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ficha do cliente
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="pro-nome">Nome do cliente</Label>
              <Input
                id="pro-nome"
                value={pro.nomeCliente}
                onChange={(e) => setPro({ ...pro, nomeCliente: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pro-cpf">CPF</Label>
              <Input
                id="pro-cpf"
                value={pro.cpfCliente}
                onChange={(e) => setPro({ ...pro, cpfCliente: formatarCpf(e.target.value) })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pro-proc">Processo / requerimento</Label>
              <Input
                id="pro-proc"
                value={pro.processo}
                onChange={(e) => setPro({ ...pro, processo: e.target.value })}
                placeholder="opcional"
              />
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            1. Dados do segurado
          </h2>
          <div className="inline-flex rounded-lg border border-border/60 bg-background/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setModo("pdf")}
              className={`rounded-md px-3 py-1.5 transition ${
                modo === "pdf"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-ink-foreground,white)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Importar CNIS (PDF)
            </button>
            <button
              type="button"
              onClick={() => setModo("manual")}
              className={`rounded-md px-3 py-1.5 transition ${
                modo === "manual"
                  ? "bg-[var(--accent-ink)] text-[var(--accent-ink-foreground,white)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preencher manualmente
            </button>
          </div>
        </header>

        {modo === "pdf" && (
          <div className="rounded-xl border border-dashed border-border/70 bg-background/40 p-6 text-center">
            <FileUp className="mx-auto h-7 w-7 text-muted-foreground" aria-hidden />
            <p className="mt-2 text-sm text-muted-foreground">
              Envie o extrato CNIS em PDF — os campos serão preenchidos automaticamente.
            </p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-background px-4 py-2 text-sm font-medium hover:bg-[var(--accent-ink-soft)]">
              {carregandoPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <FileUp className="h-4 w-4" aria-hidden />
              )}
              {carregandoPdf ? "Lendo PDF..." : "Selecionar arquivo CNIS.pdf"}
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={onPdfUpload}
                className="sr-only"
              />
            </label>
            {erroPdf && (
              <p className="mt-3 text-xs text-[var(--state-error,oklch(0.42_0.15_25))]">{erroPdf}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nasc">Data de nascimento</Label>
            <Input
              id="nasc"
              value={dataNasc}
              onChange={(e) => setDataNasc(e.target.value)}
              placeholder="DD/MM/AAAA"
              inputMode="numeric"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sexo">Sexo</Label>
            <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
              <SelectTrigger id="sexo"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="M">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tb">Tempo no Brasil (meses)</Label>
            <Input
              id="tb"
              type="number"
              min={0}
              value={tempoBrasil}
              onChange={(e) => setTempoBrasil(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          2. Acordo internacional
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pais">País do acordo</Label>
            <Select value={pais} onValueChange={setPais}>
              <SelectTrigger id="pais"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {PAISES_ACORDO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tipo">Tipo de benefício</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBeneficio)}>
              <SelectTrigger id="tipo"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aposentadoria_idade">Aposentadoria por Idade</SelectItem>
                <SelectItem value="pensao_morte">Pensão por Morte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tp">Tempo no exterior (meses)</Label>
            <Input
              id="tp"
              type="number"
              min={0}
              value={tempoPais}
              onChange={(e) => setTempoPais(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sb">Salário médio de contribuição (R$)</Label>
            <Input
              id="sb"
              type="number"
              min={0}
              step="0.01"
              value={salarioMedio}
              onChange={(e) => setSalarioMedio(e.target.value)}
            />
          </div>
        </div>
      </section>

      {erroForm && (
        <p className="rounded-md border border-[var(--state-error-soft)] bg-[var(--state-error-soft)] px-4 py-3 text-sm text-[var(--state-error)]">
          {erroForm}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <Button type="submit" size="lg" className="gap-2">
          <Calculator className="h-4 w-4" aria-hidden />
          Calcular {isPro ? "RMI pro-rata" : "meu benefício"}
        </Button>
        {isPro && resultado && (
          <Button type="button" variant="outline" onClick={() => window.print()}>
            Imprimir / Salvar PDF
          </Button>
        )}
      </div>

      {resultado && (
        <ResultadoView resultado={resultado} variant={variant} pro={pro} pais={pais} tipo={tipo} />
      )}
    </form>
  );
}

function ResultadoView({
  resultado,
  variant,
  pro,
  pais,
  tipo,
}: {
  resultado: ResultadoCalculo;
  variant: "public" | "pro";
  pro: ProInfo;
  pais: string;
  tipo: TipoBeneficio;
}) {
  const tone = toneFor(resultado.caso);
  const Icon = tone.icon;
  const carencia = CARENCIAS[tipo];
  const coef = COEFICIENTES[tipo];

  return (
    <section
      className="rounded-2xl border p-6 print:border-foreground print:bg-white"
      style={{
        borderColor: `var(${tone.border})`,
        backgroundColor: `var(${tone.bg})`,
      }}
    >
      <header className="flex items-start gap-3">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" style={{ color: `var(${tone.ink})` }} aria-hidden />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: `var(${tone.ink})` }}>
            {resultado.titulo}
          </h3>
          <p className="mt-1 text-sm text-foreground/85">{resultado.descricao}</p>
        </div>
      </header>

      {resultado.caso === 3 && resultado.rmiProrata != null && resultado.rmiTeorica != null && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Stat label="RMI Pro-rata" value={formatarMoeda(resultado.rmiProrata)} tone={tone} highlight />
          <Stat label="RMI Teórica" value={formatarMoeda(resultado.rmiTeorica)} tone={tone} />
          <Stat label="Período Brasil" value={formatarTempo(resultado.tempoBrasil)} tone={tone} />
          <Stat label="Tempo total" value={formatarTempo(resultado.tempoTotal)} tone={tone} />
        </div>
      )}

      {resultado.caso === 1 && resultado.rmiTeorica != null && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Stat label="RMI estimada (Brasil isolado)" value={formatarMoeda(resultado.rmiTeorica)} tone={tone} highlight />
          <Stat label="Tempo no Brasil" value={formatarTempo(resultado.tempoBrasil)} tone={tone} />
        </div>
      )}

      {variant === "pro" && (
        <div className="mt-6 space-y-4 print:mt-4">
          <table className="w-full text-sm">
            <tbody className="[&_tr]:border-b [&_tr]:border-border/40 [&_td]:py-2 [&_td:first-child]:pr-4 [&_td:first-child]:text-muted-foreground">
              <tr><td>Período Brasil</td><td>{formatarTempo(resultado.tempoBrasil)}</td></tr>
              <tr><td>Período Exterior</td><td>{formatarTempo(resultado.tempoPais)}</td></tr>
              <tr><td>Total</td><td>{formatarTempo(resultado.tempoTotal)}</td></tr>
              <tr><td>Carência exigida</td><td>{carencia} meses</td></tr>
              <tr><td>Status carência</td><td>{resultado.tempoTotal >= carencia ? "atingida" : `faltam ${carencia - resultado.tempoTotal} meses`}</td></tr>
              <tr><td>RMI Teórica</td><td>{resultado.rmiTeorica != null ? formatarMoeda(resultado.rmiTeorica) : "—"}</td></tr>
              <tr><td>Fator Pro-rata</td><td>{resultado.tempoTotal > 0 ? (resultado.tempoBrasil / resultado.tempoTotal).toFixed(4) : "—"}</td></tr>
              <tr><td>RMI Pro-rata</td><td>{resultado.rmiProrata != null ? formatarMoeda(resultado.rmiProrata) : "—"}</td></tr>
              <tr><td>Piso (SMmin)</td><td>{formatarMoeda(SMmin)}</td></tr>
            </tbody>
          </table>

          {resultado.caso === 3 && resultado.rmiTeorica != null && resultado.rmiProrata != null && (
            <div className="rounded-lg border border-border/60 bg-background/70 p-4 font-mono text-xs leading-relaxed">
              <div>RMI teórica = SB × coef = {formatarMoeda(resultado.rmiTeorica / coef)} × {coef} = {formatarMoeda(resultado.rmiTeorica)}</div>
              <div className="mt-1">
                RMI pro-rata = RMI teórica × (meses_BR ÷ total) ={" "}
                {formatarMoeda(resultado.rmiTeorica)} × ({resultado.tempoBrasil} ÷ {resultado.tempoTotal}) ={" "}
                {formatarMoeda(resultado.rmiProrata)}
              </div>
            </div>
          )}

          <footer className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap justify-between gap-2">
              <span>www.acordosinternacionais.com</span>
              <span>Gerado em {new Date().toLocaleDateString("pt-BR")}</span>
            </div>
            {(pro.nomeCliente || pro.cpfCliente || pro.processo) && (
              <div className="mt-1">
                {pro.nomeCliente && <>Cliente: {pro.nomeCliente} · </>}
                {pro.cpfCliente && <>CPF: {pro.cpfCliente} · </>}
                {pro.processo && <>Proc.: {pro.processo} · </>}
                País: {pais}
              </div>
            )}
          </footer>
        </div>
      )}

      {variant === "public" && (resultado.caso === 3 || resultado.caso === "2B") && (
        <div className="mt-6 rounded-xl border border-border/60 bg-background/80 p-5 backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground">
            Quer um laudo técnico completo, com fundamentação e fórmulas?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assine o Hub do Advogado e tenha acesso à calculadora profissional, modelos e jurisprudência.
          </p>
          <a
            href="/login"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-[var(--accent-ink)] px-4 py-2 text-sm font-medium text-[var(--accent-ink-foreground,white)] hover:opacity-90"
          >
            Conhecer o Hub do Advogado
          </a>
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
  highlight,
}: {
  label: string;
  value: string;
  tone: Tone;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-lg border bg-background/70 p-4 backdrop-blur-sm"
      style={{ borderColor: highlight ? `var(${tone.ink})` : "var(--border)" }}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className="mt-1 text-xl font-semibold"
        style={{ color: highlight ? `var(${tone.ink})` : undefined }}
      >
        {value}
      </div>
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
