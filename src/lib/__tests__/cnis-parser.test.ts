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
    // ~10 anos (120m) + ~5 anos 1m (61m)
    expect(r.totalMeses).toBeGreaterThan(170);
    expect(r.totalMeses).toBeLessThan(185);
  });

  it('descarta intervalos negativos e absurdos (>600m)', () => {
    const txt = `31/12/2020 01/01/2000\n01/01/1900 01/01/2099`;
    const r = parsearCNIS(txt);
    expect(r.totalMeses).toBe(0);
  });
});

describe('parsearCNIS — filtros de competências e valores', () => {
  it('descarta competências < 07/1994 (Plano Real)', () => {
    const txt = [
      '06/1994 R$ 5.000,00',
      '07/1994 R$ 3.000,00',
      '08/1994 R$ 3.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    // Só 3000 e 3000 → média 3000 (R$5000 de 06/1994 descartado)
    expect(r.mediasSalarial).toBeCloseTo(3000);
  });

  it('descarta valores fora do range (<100 ou >50000)', () => {
    const txt = [
      '07/2000 R$ 50,00',
      '07/2001 R$ 99.999,00',
      '07/2002 R$ 2.000,00',
      '07/2003 R$ 2.000,00',
    ].join('\n');
    const r = parsearCNIS(txt);
    expect(r.mediasSalarial).toBeCloseTo(2000);
  });

  it('média dos 80% maiores descarta o quintil inferior', () => {
    // 10 valores: descarta os 2 menores (corte ceil(10*0.8)=8)
    const valores = [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900];
    const txt = valores.map((v, i) => `07/${2000 + i} R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`).join('\n');
    const r = parsearCNIS(txt);
    // top 8 = 1200..1900 → média = (1200+1300+...+1900)/8 = 1550
    expect(r.mediasSalarial).toBeCloseTo(1550);
  });

  it('fallback global quando nenhuma competência casa, ainda filtra range', () => {
    const txt = `Algum texto sem datas\nValor R$ 2.000,00\nOutro R$ 4.000,00\nLixo R$ 10,00`;
    const r = parsearCNIS(txt);
    // só 2000 e 4000 entram → média top 80% = ceil(2*0.8)=2 → (2000+4000)/2 = 3000
    expect(r.mediasSalarial).toBeCloseTo(3000);
  });
});
