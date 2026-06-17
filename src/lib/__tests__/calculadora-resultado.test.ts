import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calcularResultado,
  coeficienteAposentadoriaIdade,
  coeficientePara,
  SMmin,
  CARENCIAS,
} from '../calculadora';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-29T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const CAP = CARENCIAS.aposentadoria_idade; // 180

describe('coeficiente aposentadoria por idade', () => {
  it('0.70 base + 0.01 por ano completo, cap 1.0', () => {
    expect(coeficienteAposentadoriaIdade(0)).toBeCloseTo(0.70);
    expect(coeficienteAposentadoriaIdade(180)).toBeCloseTo(0.85); // 15 anos
    expect(coeficienteAposentadoriaIdade(12 * 30)).toBeCloseTo(1.0); // 30y → 1.0
    expect(coeficienteAposentadoriaIdade(12 * 50)).toBeCloseTo(1.0); // cap
  });

  it('pensão por morte é fixa 1.0', () => {
    expect(coeficientePara('pensao_morte', 5)).toBe(1.0);
    expect(coeficientePara('pensao_morte', 500)).toBe(1.0);
  });
});

describe('calcularResultado — Caso 1 (BR cumpre carência sozinho)', () => {
  it('rmiTeorica usa piso quando SB×coef < SMmin', () => {
    const r = calcularResultado({
      tempoBrasilMeses: CAP,
      tempoPaisMeses: 60,
      sbFinal: 1000,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955',
      sexo: 'M',
      nomePais: 'Portugal',
    });
    expect(r.caso).toBe(1);
    expect(r.prestacaoTeorica).toBe(SMmin);
    expect(r.rmiTeorica).toBe(SMmin);
    expect(r.indiceProrata).toBeUndefined();
    expect(r.rmiProrata).toBeUndefined();
  });

  it('rmiTeorica = SB×coef quando acima do piso', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 240, // 20 anos → coef 0.90
      tempoPaisMeses: 0,
      sbFinal: 5000,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955',
      sexo: 'M',
      nomePais: 'Portugal',
    });
    expect(r.caso).toBe(1);
    expect(r.coeficiente).toBeCloseTo(0.90);
    expect(r.prestacaoTeoricaSemPiso).toBeCloseTo(5000 * 0.90);
    expect(r.rmiTeorica).toBeCloseTo(4500);
  });
});

describe('calcularResultado — Caso 2 / 2B', () => {
  it('Caso 2 sem campos monetários', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 50, tempoPaisMeses: 50,
      sbFinal: 3000, tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', sexo: 'M', nomePais: 'Itália',
    });
    expect(r.caso).toBe(2);
    expect(r.mesesFaltantes).toBe(CAP - 100);
    expect(r.sb).toBeUndefined();
    expect(r.rmiProrata).toBeUndefined();
  });

  it('Caso 2B projeta rmiProrata usando prestação COM piso', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 100, tempoPaisMeses: 100,
      sbFinal: 500, // forçará piso
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1980', sexo: 'M', nomePais: 'Portugal',
    });
    expect(r.caso).toBe('2B');
    expect(r.indiceProrata).toBeCloseTo(0.5);
    expect(r.prestacaoTeorica).toBe(SMmin);
    expect(r.rmiProrata).toBeCloseTo(SMmin * 0.5);
    expect((r.mesesParaIdade ?? 0) > 0).toBe(true);
  });
});

describe('calcularResultado — Caso 3 (totalização válida)', () => {
  it('piso aplica ANTES do pró-rata', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 60, tempoPaisMeses: 180, // total 240, coef 0.90
      sbFinal: 500, // 500*0.90 = 450 → ativa piso
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', sexo: 'M', nomePais: 'Portugal',
    });
    expect(r.caso).toBe(3);
    expect(r.prestacaoTeoricaSemPiso).toBeCloseTo(450);
    expect(r.prestacaoTeorica).toBe(SMmin);
    expect(r.indiceProrata).toBeCloseTo(60 / 240);
    expect(r.rmiProrata).toBeCloseTo(SMmin * (60 / 240));
  });

  it('pró-rata pode resultar em valor abaixo do SMmin (sem re-piso)', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 24, tempoPaisMeses: 200,
      sbFinal: 1700, // pouco acima do piso
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', sexo: 'M', nomePais: 'Portugal',
    });
    expect(r.caso).toBe(3);
    expect(r.rmiProrata).toBeDefined();
    expect((r.rmiProrata as number) < SMmin).toBe(true);
  });

  it('sem SB retorna coeficiente mas sem rmi/sb', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 60, tempoPaisMeses: 180,
      sbFinal: 0, tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', sexo: 'M', nomePais: 'Portugal',
    });
    expect(r.caso).toBe(3);
    expect(r.coeficiente).toBeDefined();
    expect(r.sb).toBeUndefined();
    expect(r.rmiProrata).toBeUndefined();
  });

  it('indice pró-rata = tBR / (tBR + tPais)', () => {
    const r = calcularResultado({
      tempoBrasilMeses: 120, tempoPaisMeses: 360,
      sbFinal: 5000, tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', sexo: 'M', nomePais: 'Itália',
    });
    expect(r.indiceProrata).toBeCloseTo(120 / 480);
  });
});
