import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calcularTriagem, CARENCIAS } from '../calculadora';

// Hoje fixo para tornar idade/mesesParaIdade determinísticos.
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-29T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const C = CARENCIAS.aposentadoria_idade; // 180

describe('calcularTriagem — triagem comercial (sem valores)', () => {
  it('BR_SOLO quando Brasil sozinho cumpre a carência', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: C,
      tempoPaisMeses: 60,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1960',
      sexo: 'M',
    });
    expect(r.caso).toBe('BR_SOLO');
    expect(r.tempoTotal).toBe(C + 60);
  });

  it('INSUFICIENTE retorna mesesFaltantes correto', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: 50,
      tempoPaisMeses: 50,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1965',
      sexo: 'M',
    });
    expect(r.caso).toBe('INSUFICIENTE');
    expect(r.mesesFaltantes).toBe(C - 100);
  });

  it('AGUARDA_IDADE quando carência somada ok mas idade < mínima', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: 100,
      tempoPaisMeses: 100,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1980', // 46 anos em 2026
      sexo: 'M',
    });
    expect(r.caso).toBe('AGUARDA_IDADE');
    expect(r.idadeMin).toBe(65);
    expect((r.mesesParaIdadeMin ?? 0) > 0).toBe(true);
  });

  it('TOTALIZACAO_OK quando idade e tempo somado ok', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: 100,
      tempoPaisMeses: 100,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955', // 71 anos
      sexo: 'M',
    });
    expect(r.caso).toBe('TOTALIZACAO_OK');
  });

  it('Pensão por morte ignora idade (carência 18)', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: 10,
      tempoPaisMeses: 12,
      tipo: 'pensao_morte',
      nascInput: '01/01/1995', // jovem
      sexo: 'F',
    });
    expect(r.caso).toBe('TOTALIZACAO_OK');
  });

  it('Idade mínima feminina 62, masculina 65', () => {
    const base = {
      tempoBrasilMeses: 100,
      tempoPaisMeses: 100,
      tipo: 'aposentadoria_idade' as const,
      nascInput: '01/01/1980',
    };
    expect(calcularTriagem({ ...base, sexo: 'F' }).idadeMin).toBe(62);
    expect(calcularTriagem({ ...base, sexo: 'M' }).idadeMin).toBe(65);
  });

  it('Resultado NÃO contém campos monetários/técnicos', () => {
    const r = calcularTriagem({
      tempoBrasilMeses: 100,
      tempoPaisMeses: 100,
      tipo: 'aposentadoria_idade',
      nascInput: '01/01/1955',
      sexo: 'M',
    });
    const proibidos = ['sb', 'rmi', 'rmiProrata', 'rmiTeorica', 'coeficiente', 'prestacaoTeorica', 'prestacaoTeoricaSemPiso', 'indiceProrata'];
    for (const k of proibidos) {
      expect(r).not.toHaveProperty(k);
    }
  });
});
