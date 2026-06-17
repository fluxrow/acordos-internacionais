import "./laudo-pdf.css";
import type { LaudoPayload } from "@/lib/laudo-payload";
import { formatarMoeda, formatarTempo } from "@/lib/calculadora";

function fmtDataBr(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "—";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function idadeEm(iso: string): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - d.getFullYear();
  const m = hoje.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) idade--;
  return idade;
}

function labelEspecie(t: LaudoPayload["cliente"]["especie"]): string {
  if (t === "aposentadoria_idade") return "Aposentadoria por Idade";
  if (t === "pensao_morte") return "Pensão por Morte";
  return "—";
}

function labelSexo(s: LaudoPayload["cliente"]["sexo"]): string {
  if (s === "F") return "Feminino";
  if (s === "M") return "Masculino";
  return "—";
}

export function LaudoPdf({ payload }: { payload: LaudoPayload }) {
  const { cliente, pais, paisBandeira, acordo, advogado, periodos,
    tempoBrasil, tempoPais, tempoTotal, carenciaExigida, resultado, dataAnalise, ref } = payload;

  const idade = idadeEm(cliente.dataNasc);
  const carenciaOk = tempoTotal >= carenciaExigida;
  const isCaso1 = resultado.caso === 1;
  const isCaso2 = resultado.caso === 2;
  const isCaso2B = resultado.caso === "2B";
  const isCaso3 = resultado.caso === 3;

  const rmiMostrar = isCaso1
    ? resultado.rmiTeorica
    : (resultado.rmiProrata ?? resultado.rmiTeorica);
  const fatorProrata = resultado.indiceProrata;

  return (
    <div className="laudo-root light">
      <div className="laudo-page">
        {/* Header */}
        <header className="laudo-header">
          <div className="laudo-header__brand">
            <div className="laudo-header__name">Acordos Internacionais</div>
            <div className="laudo-header__sub">Previdência · BR · AtlasPrev</div>
          </div>
          <div className="laudo-header__doc">
            <div className="laudo-header__doc-label">Documento técnico</div>
            <div className="laudo-header__doc-title">
              Laudo de Cálculo<br />RMI Pró-rata
            </div>
            <div className="laudo-header__doc-date">
              Gerado em: {fmtDataBr(dataAnalise)} · Ref. #{ref}
            </div>
          </div>
        </header>

        <main className="laudo-body">
          {/* Hero */}
          <section className="laudo-hero">
            <div className="laudo-hero__item">
              <div className="laudo-hero__label">
                {isCaso2 ? "Situação" : isCaso1 ? "RMI Integral estimada" : "RMI Pró-rata estimada"}
              </div>
              <div className="laudo-hero__value laudo-hero__value--lg">
                {isCaso2
                  ? "—"
                  : rmiMostrar != null
                    ? formatarMoeda(rmiMostrar)
                    : "Pendente"}
              </div>
              <div className="laudo-hero__sub">
                {isCaso2
                  ? "Carência insuficiente para concessão"
                  : isCaso1
                    ? "Renda Mensal Inicial — RGPS isolado (sem pró-rata)"
                    : "Renda Mensal Inicial calculada pelo método proporcional internacional"}
              </div>
            </div>

            <div className="laudo-hero__item">
              <div className="laudo-hero__label">
                {isCaso1 ? "Cálculo aplicado" : "Fator Pró-rata"}
              </div>
              <div className="laudo-hero__value">
                {isCaso1
                  ? "Integral"
                  : fatorProrata != null
                    ? fatorProrata.toFixed(4).replace(".", ",")
                    : "—"}
              </div>
              <div className="laudo-hero__sub">
                {isCaso1
                  ? "Brasil cumpre carência sem totalização"
                  : `BR: ${tempoBrasil} meses / Total: ${tempoTotal} meses`}
              </div>
            </div>

            <div className="laudo-hero__item">
              <div className="laudo-hero__label">Situação de carência</div>
              <div className="laudo-hero__value" style={{ fontSize: "11pt" }}>
                <span className={`laudo-chip ${carenciaOk ? "laudo-chip--green" : "laudo-chip--red"}`}>
                  {carenciaOk ? "✓ Carência atingida" : "✗ Carência insuficiente"}
                </span>
                {isCaso2B && (
                  <>
                    {" "}<span className="laudo-chip laudo-chip--amber">Aguarda idade mínima</span>
                  </>
                )}
              </div>
              <div className="laudo-hero__sub">
                {carenciaExigida} meses exigidos · {tempoTotal} meses totalizados
              </div>
            </div>
          </section>

          {/* Identificação */}
          <section className="laudo-section">
            <div className="laudo-section__title">Identificação do Segurado</div>
            <div className="laudo-data-grid">
              <Field label="Nome completo" value={cliente.nome || "—"} highlight />
              <Field label="CPF" value={cliente.cpf || "—"} />
              <Field
                label="Data de nascimento"
                value={
                  cliente.dataNasc
                    ? `${fmtDataBr(cliente.dataNasc)}${idade != null ? `  (${idade} anos)` : ""}`
                    : "—"
                }
              />
              <Field label="Sexo" value={labelSexo(cliente.sexo)} />
              <Field label="Espécie do benefício" value={labelEspecie(cliente.especie)} />
              <div>
                <div className="laudo-field__label">País signatário (acordo)</div>
                <div className="laudo-field__value">
                  <span className="laudo-country">
                    <span className="laudo-country__flag">{paisBandeira}</span>
                    <span className="laudo-country__name">{pais || "—"}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Períodos */}
          <section className="laudo-section">
            <div className="laudo-section__title">Períodos Contributivos — Totalização</div>
            <table className="laudo-table">
              <thead>
                <tr>
                  <th>Sistema / País</th>
                  <th>Início</th>
                  <th>Término</th>
                  <th>Meses</th>
                  <th>Computa carência?</th>
                  <th>Fonte</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map((p, i) => (
                  <tr key={i}>
                    <td>{p.sistema}</td>
                    <td>{p.inicio}</td>
                    <td>{p.fim}</td>
                    <td>{p.meses}</td>
                    <td>{p.computaCarencia ? "Sim" : "Totalização"}</td>
                    <td>{p.fonte}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Total Totalizado (BR + {pais || "Exterior"})</td>
                  <td>{tempoTotal}</td>
                  <td colSpan={2}>
                    <span className={`laudo-chip ${carenciaOk ? "laudo-chip--green" : "laudo-chip--red"}`}>
                      Carência: {carenciaExigida} meses exigidos {carenciaOk ? "✓" : "✗"}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* Parâmetros (oculta no caso 2) */}
          {!isCaso2 && (
            <section className="laudo-section">
              <div className="laudo-section__title">Parâmetros do Cálculo</div>
              <div className="laudo-data-grid laudo-data-grid--4">
                <Field
                  label="Salário de Benefício (SB)"
                  value={resultado.sb != null ? formatarMoeda(resultado.sb) : "—"}
                />
                <Field
                  label="Alíquota (coef. atuarial)"
                  value={resultado.coeficiente != null ? `${(resultado.coeficiente * 100).toFixed(0)}%` : "—"}
                />
                <Field
                  label="Prestação teórica"
                  value={resultado.prestacaoTeorica != null ? formatarMoeda(resultado.prestacaoTeorica) : "—"}
                />
                <Field
                  label={isCaso1 ? "Pró-rata" : "Fator Pró-rata aplicado"}
                  value={
                    isCaso1
                      ? "Não aplicável"
                      : fatorProrata != null
                        ? `× ${fatorProrata.toFixed(4).replace(".", ",")}`
                        : "—"
                  }
                  highlight={!isCaso1}
                />
              </div>
            </section>
          )}

          {/* Memória de cálculo (oculta no caso 2 e quando sem SB) */}
          {!isCaso2 && resultado.prestacaoTeorica != null && (
            <section className="laudo-section">
              <div className="laudo-section__title">Memória de Cálculo — Fórmulas</div>
              <div className="laudo-formula">
                <div className="laudo-formula__title">
                  {isCaso1 ? "Método integral — Art. 29, II, Lei 8.213/91" : `Método Pró-rata — Acordo BR–${pais}`}
                </div>

                {resultado.prestacaoTeoricaSemPiso != null && resultado.sb != null && (
                  <div className="laudo-formula__line">
                    <span className="laudo-formula__label">Prestação teórica (SB × coef.)</span>
                    <span className="laudo-formula__expr">
                      {formatarMoeda(resultado.sb)} × {(resultado.coeficiente ?? 1).toFixed(2)}
                    </span>
                    <span className="laudo-formula__result">
                      = {formatarMoeda(resultado.prestacaoTeoricaSemPiso)}
                    </span>
                  </div>
                )}

                {resultado.prestacaoTeoricaSemPiso != null
                  && resultado.prestacaoTeorica != null
                  && resultado.prestacaoTeorica !== resultado.prestacaoTeoricaSemPiso && (
                  <div className="laudo-formula__line">
                    <span className="laudo-formula__label">Piso do salário mínimo (antes do pró-rata)</span>
                    <span className="laudo-formula__expr">
                      max(prestação, SM mínimo)
                    </span>
                    <span className="laudo-formula__result">
                      = {formatarMoeda(resultado.prestacaoTeorica)}
                    </span>
                  </div>
                )}

                {!isCaso1 && fatorProrata != null && (
                  <div className="laudo-formula__line">
                    <span className="laudo-formula__label">Fator Pró-rata</span>
                    <span className="laudo-formula__expr">
                      T_BR ÷ T_Total = {tempoBrasil} ÷ {tempoTotal}
                    </span>
                    <span className="laudo-formula__result">
                      = {fatorProrata.toFixed(4).replace(".", ",")}
                    </span>
                  </div>
                )}

                {rmiMostrar != null && (
                  <div className="laudo-formula__line">
                    <span className="laudo-formula__label">
                      {isCaso1 ? "RMI Integral" : "RMI Pró-rata Final"}
                    </span>
                    <span className="laudo-formula__expr">
                      {isCaso1
                        ? `${formatarMoeda(resultado.prestacaoTeorica ?? 0)}`
                        : `${formatarMoeda(resultado.prestacaoTeorica ?? 0)} × ${fatorProrata?.toFixed(4).replace(".", ",")}`}
                    </span>
                    <span className="laudo-formula__result">
                      = {formatarMoeda(rmiMostrar)}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Detalhamento pró-rata (caso 2B/3) */}
          {!isCaso1 && !isCaso2 && (
            <section className="laudo-section">
              <div className="laudo-section__title">Detalhamento do Pró-rata</div>
              <div className="laudo-data-grid laudo-data-grid--4">
                <Field label="Tempo Brasil (T_BR)" value={`${tempoBrasil} meses (${formatarTempo(tempoBrasil)})`} />
                <Field label={`Tempo ${pais || "Exterior"} (T_Pais)`} value={`${tempoPais} meses (${formatarTempo(tempoPais)})`} />
                <Field label="Tempo Total (T_Total)" value={`${tempoTotal} meses (${formatarTempo(tempoTotal)})`} highlight />
                <Field
                  label="Índice T_BR ÷ T_Total"
                  value={fatorProrata != null ? fatorProrata.toFixed(4).replace(".", ",") : "—"}
                  highlight
                />
              </div>
            </section>
          )}

          {/* Fundamento legal */}
          <section className="laudo-section">
            <div className="laudo-section__title">Fundamento Legal</div>
            <div className="laudo-data-grid laudo-data-grid--2">
              <Field label="Acordo internacional aplicado" value={acordo.nome} />
              <Field label="Decreto de promulgação" value={acordo.decreto} />
              <Field label="Dispositivo do cálculo pró-rata" value={acordo.dispositivoProrata} />
              <Field label="Carência — Espécie" value={acordo.carenciaArt} />
            </div>
          </section>

          {/* Nota técnica */}
          <section className="laudo-nota">
            <span className="laudo-nota__icon">§</span>
            <div className="laudo-nota__text">
              <strong>Nota técnica:</strong> este laudo foi gerado pela Calculadora Totalização Pro
              do Hub Profissional · Acordos Internacionais (AtlasPrev). Os valores são estimativas
              com base nos dados informados e na legislação vigente na data de análise ({fmtDataBr(dataAnalise)}).
              O Salário de Benefício não considera correção do INPC. O resultado não substitui análise
              individualizada pelo INSS nem decisão judicial. O profissional responsável pelo documento
              é o único apto a orientar o segurado quanto à estratégia processual.
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="laudo-footer">
          <div>
            <div className="laudo-footer__label">Responsável pelo laudo</div>
            <div className="laudo-footer__name">{advogado.nome || "Dr. [Nome do Advogado]"}</div>
            <div className="laudo-footer__sub">
              {advogado.oab || "OAB/XX 000.000"} · Direito Previdenciário Internacional
            </div>
            <div className="laudo-footer__sig-line" />
            <div className="laudo-footer__label" style={{ marginTop: "1.5mm" }}>
              Assinatura / Carimbo
            </div>
          </div>
          <div className="laudo-footer__right">
            <div className="laudo-footer__brand">
              Acordos <span>Internacionais</span>
            </div>
            <div className="laudo-footer__url">
              acordosinternacionais.com · Hub Profissional
            </div>
            <div className="laudo-footer__disclaimer">
              Laudo gerado via Hub do Advogado — AtlasPrev © {new Date(dataAnalise || new Date()).getFullYear()}<br />
              Documento informativo. Não substitui orientação jurídica individualizada.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="laudo-field__label">{label}</div>
      <div className={`laudo-field__value${highlight ? " laudo-field__value--hl" : ""}`}>{value}</div>
    </div>
  );
}
