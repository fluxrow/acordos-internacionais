import { useState, useRef } from "react";
import {
  FileUp,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  Loader2,
  Save,
  Check,
  Printer,
  Eraser,
  Scale,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { saveCalc } from "@/lib/hub-personal.functions";
import {
  PAISES_ACORDO,
  CARENCIAS,
  COEFICIENTES,
  SMmin,
  calcularResultado,
  calcMesesEntreDatas,
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

// ─── helpers ───────────────────────────────────────────────────────────────
const formatarCpf = (raw: string) =>
  raw
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const isoToBr = (iso: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

const brToIso = (br: string) => {
  if (!br || !/^\d{2}\/\d{2}\/\d{4}$/.test(br)) return "";
  const [d, m, a] = br.split("/");
  return `${a}-${m}-${d}`;
};

const hoje = () => new Date().toISOString().slice(0, 10);

// ─── component ─────────────────────────────────────────────────────────────
export function CalculadoraFormPro() {
  // Identificação
  const [clienteNome, setClienteNome] = useState("");
  const [clienteCpf, setClienteCpf] = useState("");
  const [dataAnalise, setDataAnalise] = useState(hoje());
  const [dataNasc, setDataNasc] = useState(""); // ISO
  const [sexo, setSexo] = useState<Sexo | "">("");
  const [advogado, setAdvogado] = useState("");

  // Parâmetros
  const [tipo, setTipo] = useState<TipoBeneficio | "">("");
  const [pais, setPais] = useState("");

  // CNIS / Brasil
  const [carregandoPdf, setCarregandoPdf] = useState(false);
  const [cnisStatus, setCnisStatus] = useState<{ ok?: boolean; msg: string } | null>(null);
  const [cnisCarregado, setCnisCarregado] = useState(false);
  const [salarioManual, setSalarioManual] = useState("");
  const [anos, setAnos] = useState("");
  const [meses, setMeses] = useState("");

  // Exterior
  const [dataInicPais, setDataInicPais] = useState("");
  const [dataFimPais, setDataFimPais] = useState("");
  const [periodoMesesPais, setPeriodoMesesPais] = useState("");

  // Resultado
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ─── upload CNIS ─────────────────────────────────────────────────────────
  async function lerCnis(file: File) {
    setCarregandoPdf(true);
    setCnisStatus({ msg: "Processando CNIS..." });
    try {
      const texto = await extrairTextoPdf(file);
      const dados = parsearCNIS(texto);
      if (dados.nome && !clienteNome.trim()) setClienteNome(dados.nome);
      if (dados.cpf && !clienteCpf.trim()) setClienteCpf(dados.cpf);
      if (dados.dataNasc && !dataNasc) setDataNasc(brToIso(dados.dataNasc));
      if (dados.totalMeses > 0) {
        setAnos(String(Math.floor(dados.totalMeses / 12)));
        setMeses(String(dados.totalMeses % 12));
      }
      if (dados.mediasSalarial > 0) setSalarioManual(dados.mediasSalarial.toFixed(2));
      setCnisCarregado(true);
      const nomeMsg = dados.nome ? ` · ${dados.nome}` : "";
      setCnisStatus({
        ok: true,
        msg: `CNIS carregado${nomeMsg} — ${dados.totalMeses} meses de vínculo`,
      });
    } catch (err) {
      console.error(err);
      setCnisStatus({ ok: false, msg: "Não foi possível ler este PDF. Preencha manualmente." });
    } finally {
      setCarregandoPdf(false);
    }
  }

  // ─── calcular ────────────────────────────────────────────────────────────
  function onCalcular(e: React.FormEvent) {
    e.preventDefault();
    setErroForm(null);
    setResultado(null);

    if (!tipo) return setErroForm("Selecione a espécie do benefício.");
    if (!pais) return setErroForm("Selecione o país signatário.");
    if (!dataNasc) return setErroForm("Informe a data de nascimento.");
    if (!sexo) return setErroForm("Informe o sexo.");

    const tb = (parseInt(anos, 10) || 0) * 12 + (parseInt(meses, 10) || 0);
    if (tb <= 0) return setErroForm("Informe o tempo de contribuição no Brasil.");

    const sb = parseFloat((salarioManual || "0").replace(",", "."));
    if (!sb || sb <= 0) return setErroForm("Informe o Salário de Benefício ou carregue o CNIS.");

    let tp = parseInt(periodoMesesPais, 10) || 0;
    if (!tp && dataInicPais && dataFimPais) {
      tp = calcMesesEntreDatas(dataInicPais, dataFimPais);
    }
    if (tp <= 0) return setErroForm("Informe o período de filiação no país signatário.");

    const r = calcularResultado({
      tempoBrasilMeses: tb,
      tempoPaisMeses: tp,
      sbFinal: Math.max(sb, SMmin),
      tipo,
      nascInput: isoToBr(dataNasc),
      sexo,
      nomePais: pais,
    });
    setResultado(r);
  }

  function limpar() {
    setClienteNome("");
    setClienteCpf("");
    setDataAnalise(hoje());
    setDataNasc("");
    setSexo("");
    setAdvogado("");
    setTipo("");
    setPais("");
    setSalarioManual("");
    setAnos("");
    setMeses("");
    setDataInicPais("");
    setDataFimPais("");
    setPeriodoMesesPais("");
    setResultado(null);
    setErroForm(null);
    setCnisStatus(null);
    setCnisCarregado(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const tb = (parseInt(anos, 10) || 0) * 12 + (parseInt(meses, 10) || 0);
  const sbFinal = Math.max(parseFloat((salarioManual || "0").replace(",", ".")) || 0, SMmin);

  return (
    <form onSubmit={onCalcular} className="calc-form space-y-10">
      {/* ============ 1. IDENTIFICAÇÃO ============ */}
      <Secao titulo="Identificação do Cliente">
        <div className="rounded-sm border border-border bg-paper-soft/40 p-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Campo label="Nome completo" htmlFor="cli-nome">
              <Input id="cli-nome" value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} placeholder="Nome do segurado" />
            </Campo>
            <Campo label="CPF" htmlFor="cli-cpf">
              <Input id="cli-cpf" value={clienteCpf} onChange={(e) => setClienteCpf(formatarCpf(e.target.value))} placeholder="000.000.000-00" />
            </Campo>
            <Campo label="Data da análise" htmlFor="cli-data">
              <Input id="cli-data" type="date" value={dataAnalise} onChange={(e) => setDataAnalise(e.target.value)} />
            </Campo>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Campo label="Data de nascimento" htmlFor="cli-nasc" dica="Necessária para verificar idade mínima">
              <Input id="cli-nasc" type="date" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} />
            </Campo>
            <Campo label="Sexo" htmlFor="cli-sexo">
              <Select value={sexo} onValueChange={(v) => setSexo(v as Sexo)}>
                <SelectTrigger id="cli-sexo"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Feminino — idade mínima 62 anos</SelectItem>
                  <SelectItem value="M">Masculino — idade mínima 65 anos</SelectItem>
                </SelectContent>
              </Select>
            </Campo>
          </div>
          <Campo label="Responsável / Advogado" htmlFor="cli-adv">
            <Input id="cli-adv" value={advogado} onChange={(e) => setAdvogado(e.target.value)} placeholder="Nome do responsável" />
          </Campo>
        </div>
      </Secao>

      {/* ============ 2. BENEFÍCIO ============ */}
      <Secao titulo="Parâmetros do Benefício">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Espécie do benefício" htmlFor="tipo" dica="Carência: 180 meses (Ap. Idade) · 18 meses (Pensão)">
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBeneficio)}>
              <SelectTrigger id="tipo"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aposentadoria_idade">Aposentadoria por Idade</SelectItem>
                <SelectItem value="pensao_morte">Pensão por Morte</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="País signatário (acordo)" htmlFor="pais">
            <Select value={pais} onValueChange={setPais}>
              <SelectTrigger id="pais"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {PAISES_ACORDO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
        </div>
      </Secao>

      {/* ============ 3. BRASIL ============ */}
      <Secao titulo="Tempo de Contribuição — Brasil (RGPS)">
        <label
          className={`block rounded-sm border border-dashed p-6 text-center cursor-pointer transition ${
            cnisCarregado
              ? "border-[var(--accent-ink)] bg-paper-soft/60"
              : "border-border bg-background/40 hover:border-foreground/40 hover:bg-paper-soft/40"
          }`}
        >
          {cnisCarregado ? (
            <Check className="mx-auto h-6 w-6 text-[var(--accent-ink)]" strokeWidth={1.5} aria-hidden />
          ) : (
            <FileUp className="mx-auto h-6 w-6 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          )}
          <p className="mt-2 font-serif text-base">Carregar CNIS em PDF</p>
          <p className="text-xs text-muted-foreground">Extrato de Contribuição do INSS · até 20 MB</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) lerCnis(f);
            }}
          />
        </label>

        {(carregandoPdf || cnisStatus) && (
          <p
            className={`mt-2 text-xs ${
              carregandoPdf
                ? "text-muted-foreground"
                : cnisStatus?.ok
                  ? "text-foreground"
                  : "text-[var(--state-error)]"
            }`}
          >
            {carregandoPdf ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Processando CNIS…</span>
            ) : (
              <>{cnisStatus?.msg}</>
            )}
          </p>
        )}

        <p className="my-4 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">— ou inserir manualmente —</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Salário de Benefício médio (SB) — R$" htmlFor="sb" dica="Média dos SC corrigidos pelo IPCA-E (80% maiores)">
            <Input id="sb" type="number" min={0} step="0.01" value={salarioManual} onChange={(e) => setSalarioManual(e.target.value)} placeholder="Ex: 4200.00" />
          </Campo>
          <Campo label="Tempo contribuído no Brasil" htmlFor="anos" dica="Total de vínculos computados no RGPS">
            <div className="grid grid-cols-2 gap-2">
              <Input id="anos" type="number" min={0} value={anos} onChange={(e) => setAnos(e.target.value)} placeholder="Anos" />
              <Input id="meses" type="number" min={0} max={11} value={meses} onChange={(e) => setMeses(e.target.value)} placeholder="Meses" />
            </div>
          </Campo>
        </div>

        <p className="mt-3 border-l border-[var(--accent-ink)] pl-3 text-xs text-foreground/75">
          Se o CNIS for carregado, os valores do PDF prevalecem sobre os campos manuais.
        </p>
      </Secao>

      {/* ============ 4. EXTERIOR ============ */}
      <Secao titulo="Período de Filiação — País Signatário">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Data de início (país signatário)" htmlFor="ext-ini">
            <Input id="ext-ini" type="date" value={dataInicPais} onChange={(e) => setDataInicPais(e.target.value)} />
          </Campo>
          <Campo label="Data de término (país signatário)" htmlFor="ext-fim">
            <Input id="ext-fim" type="date" value={dataFimPais} onChange={(e) => setDataFimPais(e.target.value)} />
          </Campo>
        </div>
        <div className="mt-3 max-w-xs">
          <Campo label="Ou: total em meses" htmlFor="ext-meses" dica="Prevalece sobre as datas acima, se preenchido">
            <Input id="ext-meses" type="number" min={0} value={periodoMesesPais} onChange={(e) => setPeriodoMesesPais(e.target.value)} placeholder="Ex: 72" />
          </Campo>
        </div>
      </Secao>

      {erroForm && (
        <p className="border-l-2 border-[var(--state-error)] bg-[var(--state-error-soft)]/40 px-4 py-3 text-sm text-[var(--state-error)]">
          {erroForm}
        </p>
      )}

      {/* ============ AÇÕES ============ */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button type="submit" size="lg" className="gap-2 rounded-sm">
          <Scale className="h-4 w-4" aria-hidden />
          Calcular RMI Pro-rata
        </Button>
        {resultado && (
          <>
            <Button type="button" variant="outline" onClick={() => window.print()} className="gap-2 rounded-sm">
              <Printer className="h-4 w-4" aria-hidden /> Imprimir / PDF
            </Button>
            <SalvarCalculoButton
              pais={pais}
              tipo={tipo as TipoBeneficio}
              resultado={resultado}
              inputs={{
                clienteNome, clienteCpf, dataAnalise, dataNasc, sexo, advogado,
                tempoBrasilMeses: tb, salarioMedio: sbFinal,
              }}
            />
          </>
        )}
        <Button type="button" variant="ghost" onClick={limpar} className="gap-2 ml-auto rounded-sm">
          <Eraser className="h-4 w-4" aria-hidden /> Limpar
        </Button>
      </div>

      {/* ============ RESULTADO (LAUDO) ============ */}
      {resultado && (
        <Laudo
          resultado={resultado}
          tipo={tipo as TipoBeneficio}
          pais={pais}
          cliente={{ nome: clienteNome, cpf: clienteCpf, dataAnalise, dataNasc, sexo, advogado }}
        />
      )}
    </form>
  );
}

// ─── Secao / Campo ─────────────────────────────────────────────────────────
function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <header className="border-b border-border pb-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">{titulo}</h2>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Campo({
  label, htmlFor, dica, children,
}: { label: string; htmlFor: string; dica?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</Label>
      {children}
      {dica && <p className="text-[11px] text-muted-foreground">{dica}</p>}
    </div>
  );
}

// ─── Laudo (resultado) ─────────────────────────────────────────────────────
type ClienteInfo = {
  nome: string; cpf: string; dataAnalise: string; dataNasc: string;
  sexo: Sexo | ""; advogado: string;
};

function Laudo({
  resultado, tipo, pais, cliente,
}: { resultado: ResultadoCalculo; tipo: TipoBeneficio; pais: string; cliente: ClienteInfo }) {
  const carencia = CARENCIAS[tipo];
  const coef = COEFICIENTES[tipo];
  const tipoLabel = tipo === "pensao_morte" ? "Pensão por Morte" : "Aposentadoria por Idade";

  const tone = toneFor(resultado.caso);
  const Icon = tone.icon;

  return (
    <section
      className="rounded-2xl border-2 p-6 print:border print:rounded-none"
      style={{ borderColor: `var(${tone.border})`, backgroundColor: `var(${tone.bg})` }}
    >
      {/* Cabeçalho cliente (visível na tela + impressão) */}
      <CabecalhoCliente cliente={cliente} />

      <header className="flex items-start gap-3">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" style={{ color: `var(${tone.ink})` }} aria-hidden />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: `var(${tone.ink})` }}>
            {resultado.titulo}
          </h3>
          <p className="mt-1 text-sm text-foreground/85">{resultado.descricao}</p>
        </div>
      </header>

      {/* QUADRO DESTAQUE — caso 3 */}
      {resultado.caso === 3 && resultado.rmiProrata != null && resultado.rmiTeorica != null && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Destaque label="RMI Pro-rata (Brasil)" sub="parte proporcional paga pelo INSS" value={formatarMoeda(resultado.rmiProrata)} tone={tone} highlight />
          <Destaque label="RMI Teórica" sub={`SB × ${(coef * 100).toFixed(0)}%`} value={formatarMoeda(resultado.rmiTeorica)} tone={tone} />
        </div>
      )}

      {/* CONTADOR — caso 2B */}
      {resultado.caso === "2B" && resultado.mesesParaIdade != null && cliente.dataNasc && cliente.sexo && (
        <PlanejContador
          mesesParaIdade={resultado.mesesParaIdade}
          sexo={cliente.sexo}
          dataNasc={cliente.dataNasc}
        />
      )}

      {/* TABELA TÉCNICA */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60 bg-background/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 text-left">Parâmetro técnico</th>
              <th className="px-3 py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:border-b [&_tr:last-child]:border-b-0 [&_tr]:border-border/40 [&_td]:px-3 [&_td]:py-2 [&_td:last-child]:text-right [&_td:last-child]:font-semibold">
            <tr><td className="text-muted-foreground">Espécie</td><td>{tipoLabel}</td></tr>
            <tr><td className="text-muted-foreground">País signatário</td><td>{pais}</td></tr>
            <tr><td className="text-muted-foreground">Carência exigida</td><td>{carencia} meses ({formatarTempo(carencia)})</td></tr>
            <tr><td className="text-muted-foreground">Tempo RGPS — Brasil</td><td>{resultado.tempoBrasil} meses ({formatarTempo(resultado.tempoBrasil)})</td></tr>
            <tr><td className="text-muted-foreground">Tempo {pais}</td><td>{resultado.tempoPais} meses ({formatarTempo(resultado.tempoPais)})</td></tr>
            <tr><td className="text-muted-foreground">Total combinado</td><td>{resultado.tempoTotal} meses ({formatarTempo(resultado.tempoTotal)})</td></tr>
            <tr>
              <td className="text-muted-foreground">Status carência</td>
              <td>{resultado.tempoTotal >= carencia ? "✓ atingida" : `⏳ faltam ${carencia - resultado.tempoTotal} meses`}</td>
            </tr>
            {resultado.rmiTeorica != null && (
              <tr><td className="text-muted-foreground">RMI Teórica</td><td>{formatarMoeda(resultado.rmiTeorica)}</td></tr>
            )}
            {resultado.tempoTotal > 0 && (
              <tr><td className="text-muted-foreground">Índice Pro-rata (BR ÷ Total)</td><td>{((resultado.tempoBrasil / resultado.tempoTotal) * 100).toFixed(4)}%</td></tr>
            )}
            {resultado.rmiProrata != null && (
              <tr style={{ backgroundColor: `var(${tone.bg})` }}>
                <td className="text-muted-foreground"><strong>RMI Pro-rata</strong></td>
                <td><strong style={{ color: `var(${tone.ink})` }}>{formatarMoeda(resultado.rmiProrata)}</strong></td>
              </tr>
            )}
            <tr><td className="text-muted-foreground">Piso (Salário-mínimo)</td><td>{formatarMoeda(SMmin)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* FÓRMULA */}
      {resultado.caso === 3 && resultado.rmiTeorica != null && resultado.rmiProrata != null && (
        <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground/80">
          <div>RMI teórica = SB × coef = {formatarMoeda(resultado.rmiTeorica / coef)} × {(coef * 100).toFixed(0)}% = <strong>{formatarMoeda(resultado.rmiTeorica)}</strong></div>
          <div className="mt-1">
            RMI pro-rata = RMI teórica × (meses_BR ÷ total) = {formatarMoeda(resultado.rmiTeorica)} × ({resultado.tempoBrasil} ÷ {resultado.tempoTotal}) = <strong>{formatarMoeda(resultado.rmiProrata)}</strong>
          </div>
        </div>
      )}

      {/* RODAPÉ */}
      <footer className="mt-6 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap justify-between gap-2">
          <span>www.acordosinternacionais.com — Cálculo de RMI Pro-rata (Acordos Internacionais)</span>
          <span>Documento gerado em {new Date().toLocaleDateString("pt-BR")}</span>
        </div>
      </footer>
    </section>
  );
}

function CabecalhoCliente({ cliente }: { cliente: ClienteInfo }) {
  const hasInfo = cliente.nome || cliente.cpf || cliente.advogado || cliente.dataNasc;
  if (!hasInfo) return null;
  const fmt = (iso: string) => (iso ? isoToBr(iso) : "—");
  const sexoLabel = cliente.sexo === "F" ? "Feminino" : cliente.sexo === "M" ? "Masculino" : "—";
  return (
    <div className="mb-5 rounded-lg border border-border/60 bg-background/80 p-4 print:bg-white">
      <div className="grid gap-3 md:grid-cols-3 text-sm">
        <Info label="Cliente" value={cliente.nome || "—"} />
        <Info label="CPF" value={cliente.cpf || "—"} />
        <Info label="Data da análise" value={fmt(cliente.dataAnalise)} />
        <Info label="Nascimento" value={fmt(cliente.dataNasc)} />
        <Info label="Sexo" value={sexoLabel} />
        <Info label="Responsável" value={cliente.advogado || "—"} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}

function Destaque({
  label, sub, value, tone, highlight,
}: { label: string; sub?: string; value: string; tone: Tone; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border-2 bg-background/80 p-5 print:bg-white"
      style={{ borderColor: highlight ? `var(${tone.ink})` : "var(--border)" }}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold" style={{ color: highlight ? `var(${tone.ink})` : undefined }}>{value}</div>
      {sub && <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function PlanejContador({
  mesesParaIdade, sexo, dataNasc,
}: { mesesParaIdade: number; sexo: Sexo; dataNasc: string }) {
  const idadeMin = sexo === "F" ? 62 : 65;
  const nasc = new Date(dataNasc + "T12:00:00");
  const agora = new Date();
  let idadeAtual = agora.getFullYear() - nasc.getFullYear();
  const m = agora.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && agora.getDate() < nasc.getDate())) idadeAtual--;
  const a = Math.floor(mesesParaIdade / 12);
  const mm = mesesParaIdade % 12;
  const faltam = a > 0 && mm > 0 ? `${a}a ${mm}m` : a > 0 ? `${a} ano${a > 1 ? "s" : ""}` : `${mm} meses`;

  return (
    <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border-2 border-[var(--state-info)] bg-[var(--state-info-soft)] p-4 text-center">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--state-info)]/80">Idade atual</div>
        <div className="mt-1 text-2xl font-bold text-[var(--state-info)]">{idadeAtual} anos</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--state-info)]/80">Idade mínima</div>
        <div className="mt-1 text-2xl font-bold text-[var(--state-info)]">{idadeMin} anos</div>
        <div className="text-[10px] text-[var(--state-info)]/70">EC 103/2019</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--state-info)]/80">Faltam</div>
        <div className="mt-1 text-2xl font-bold text-[var(--state-info)]">{faltam}</div>
      </div>
    </div>
  );
}

// ─── tone ──────────────────────────────────────────────────────────────────
type Tone = {
  ink: string; bg: string; border: string;
  icon: typeof AlertTriangle;
};

function toneFor(caso: ResultadoCalculo["caso"]): Tone {
  switch (caso) {
    case 1: return { ink: "--state-warning", bg: "--state-warning-soft", border: "--state-warning", icon: AlertTriangle };
    case 2: return { ink: "--state-error", bg: "--state-error-soft", border: "--state-error", icon: XCircle };
    case "2B": return { ink: "--state-info", bg: "--state-info-soft", border: "--state-info", icon: Clock };
    case 3: return { ink: "--state-success", bg: "--state-success-soft", border: "--state-success", icon: CheckCircle2 };
  }
}

// ─── Salvar ────────────────────────────────────────────────────────────────
function SalvarCalculoButton({
  pais, tipo, inputs, resultado,
}: {
  pais: string;
  tipo: TipoBeneficio;
  inputs: Record<string, unknown>;
  resultado: ResultadoCalculo;
}) {
  const [saved, setSaved] = useState(false);
  const m = useMutation({
    mutationFn: () =>
      saveCalc({
        data: {
          pais: pais || "—",
          tipo,
          inputs: JSON.stringify(inputs),
          resultado: JSON.stringify(resultado),
          rotulo: null,
        },
      }),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    },
  });

  return (
    <Button type="button" variant="outline" onClick={() => m.mutate()} disabled={m.isPending || !pais} className="gap-2">
      {m.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      {saved ? "Salvo no histórico" : "Salvar este cálculo"}
    </Button>
  );
}

