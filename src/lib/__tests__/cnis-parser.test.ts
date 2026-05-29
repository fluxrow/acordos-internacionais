import { describe, it, expect } from 'vitest';
import { parsearCNIS } from '../cnis-parser';

describe('parsearCNIS — extração de cabeçalho', () => {
  it('extrai nome, CPF e data de nascimento', () => {
    const txt = `
      Extrato CNIS
      Nome: JOAO DA SILVA SAURO
      CPF: 123.456.789-00
      Data de Nascimento: 15/03/1965
    `;
    const r = parsearCNIS(txt);
    expect(r.nome).toMatch(/JOAO DA SILVA/);
    expect(r.cpf).toBe('123.456.789-00');
    expect(r.dataNasc).toBe('15/03/1965');
  });

  it('aceita variações de rótulo (Nome do Segurado, CPF/MF, DN)', () => {
    const txt = `
      Nome do Segurado: MARIA OLIVEIRA
      CPF/MF: 111.222.333-44
      DN: 01/01/1970
    `;
    const r = parsearCNIS(txt);
    expect(r.nome).toMatch(/MARIA OLIVEIRA/);
    expect(r.cpf).toBe('111.222.333-44');
    expect(r.dataNasc).toBe('01/01/1970');
  });

  it('CNIS vazio retorna zeros sem lançar', () => {
    const r = parsearCNIS('');
    expect(r.nome).toBe('');
    expect(r.cpf).toBe('');
    expect(r.dataNasc).toBe('');
    expect(r.totalMeses).toBe(0);
    expect(r.mediasSalarial).toBe(0);
  });
});

describe('parsearCNIS — soma de períodos', () => {
  it('soma pares dd/mm/aaaa dd/mm/aaaa', () => {
    const txt = `01/01/2000 31/12/2009\n01/06/2010 30/06/2015`;
    const r = parsearCNIS(txt);
    expect(r.totalMeses).toBeGreaterThan(170);
    expect(r.totalMeses).toBeLessThan(185);
  });

  it('descarta intervalos negativos e absurdos (>600m)', () => {
    const txt = `31/12/2020 01/01/2000\n01/01/1900 01/01/2099`;
    const r = parsearCNIS(txt);
    expect(r.totalMeses).toBe(0);
  });
});

describe('parsearCNIS — filtro de competência ≥ 07/1994', () => {
  it('descarta 06/1994 e mantém 07/1994', () => {
    const txt = [
      '06/1994 R$ 5.000,00', // descartado: antes do Plano Real
      '07/1994 R$ 3.000,00',
      '08/1994 R$ 3.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(3000);
  });

  it('reconhece formato aaaa-mm', () => {
    const txt = [
      '1994-06 R$ 9.999,00', // descartado
      '1994-07 R$ 2.500,00',
      '1995-01 R$ 2.500,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(2500);
  });

  it('reconhece mês por extenso (jul/1994)', () => {
    const txt = [
      'jun/1994 R$ 9.999,00', // descartado
      'jul/1994 R$ 1.800,00',
      'Ago/1994 R$ 1.800,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(1800);
  });
});

describe('parsearCNIS — pareamento competência↔valor', () => {
  it('linha única: comp + valor na mesma linha', () => {
    const txt = [
      '07/2000 R$ 50,00',         // fora de range
      '07/2001 R$ 99.999,00',     // fora de range
      '07/2002 R$ 2.000,00',
      '07/2003 R$ 2.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(2000);
  });

  it('média dos 80% maiores descarta quintil inferior', () => {
    const valores = [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900];
    const txt = valores
      .map((v, i) => `07/${2000 + i} R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(1550);
  });

  it('layout colunar: bloco de competências seguido de bloco de valores', () => {
    const txt = [
      '07/2010',
      '08/2010',
      '09/2010',
      '10/2010',
      '11/2010',
      '12/2010',
      '1.000,00',
      '2.000,00',
      '3.000,00',
      '4.000,00',
      '5.000,00',
      '6.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    // 6 valores: top 80% = ceil(6*0.8)=5 → (6+5+4+3+2)k / 5 = 4000
    expect(r.mediasSalarial).toBeCloseTo(4000);
  });

  it('ignora linha de Total sem competência', () => {
    const txt = [
      '07/2005 R$ 2.000,00',
      '08/2005 R$ 2.000,00',
      'Total consolidado: R$ 99.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(2000);
    expect(r.mediasSalarial).toBeLessThan(10000);
  });

  it('vínculos paralelos: soma SC da mesma competência', () => {
    const txt = [
      '07/2010 R$ 1.000,00',
      '07/2010 R$ 1.500,00',
      '08/2010 R$ 2.500,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    // dedup soma: 07/2010 → 2500, 08/2010 → 2500 → média = 2500
    expect(r.mediasSalarial).toBeCloseTo(2500);
  });

  it('fallback global quando nenhuma competência casa', () => {
    const txt = `Algum texto sem datas\nValor R$ 2.000,00\nOutro R$ 4.000,00\nLixo R$ 10,00`;
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(3000);
  });
});
