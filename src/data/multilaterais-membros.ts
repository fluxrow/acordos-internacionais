// Países-membros dos acordos multilaterais e seus órgãos de ligação
// (quando há órgão próprio documentado). Para os demais membros, a
// referência continua sendo o organismo de ligação do respectivo acordo
// bilateral — frase exibida abaixo dos cards.

import type { OrgaoLigacao } from "./acordos.types";

export interface MembroMultilateral {
  nome: string;
  iso: string; // alpha-2 lowercase (flagcdn)
  orgao?: OrgaoLigacao;
}

export const MULTILATERAIS_MEMBROS: Record<string, MembroMultilateral[]> = {
  iberoamericano: [
    {
      nome: "Bolívia",
      iso: "bo",
      orgao: {
        titulo: "Órgão de Ligação (Bolívia)",
        instituicao: "Autoridad de Fiscalización y Control de Pensiones y Seguros",
        endereco:
          "Calle Reyes Ortiz, Nº 73, Edificio Torres Gundlach, Torre Este, Casilla 10794 — La Paz, Bolívia",
        telefone: "+591 2 233-1212",
        email: "contactenos@aps.gob.bo",
      },
    },
    {
      nome: "Equador",
      iso: "ec",
      orgao: {
        titulo: "Órgão de Ligação (Equador)",
        instituicao:
          "Instituto Equatoriano de Seguridad Social — Secretaria Geral · Convenios Internacionales",
        endereco: "Avenida 10 de Agosto, Edificio Matriz, 6º Piso — Quito, Equador",
      },
    },
    {
      nome: "El Salvador",
      iso: "sv",
      orgao: {
        titulo: "Órgão de Ligação (El Salvador)",
        instituicao: "Superintendencia de Pensiones de El Salvador",
        endereco: "79 Av. Sur, #137, Colonia La Mascota, San Salvador",
        telefone: "+503 2560-9200",
        email: "info@isp.gob.sv",
      },
    },
    {
      nome: "Peru",
      iso: "pe",
      orgao: {
        titulo: "Órgão de Ligação (Peru)",
        instituicao: "Ministerio de Trabajo y Promoción del Empleo",
        endereco: "Avenida Salaverry, 655 — Jesús María, Peru",
        email: "gsalazar@trabajo.gob.pe",
      },
    },
  ],
  mercosul: [
    { nome: "Argentina", iso: "ar" },
    { nome: "Paraguai", iso: "py" },
    { nome: "Uruguai", iso: "uy" },
  ],
  cplp: [
    { nome: "Angola", iso: "ao" },
    { nome: "Cabo Verde", iso: "cv" },
    { nome: "Guiné-Bissau", iso: "gw" },
    { nome: "Moçambique", iso: "mz" },
    { nome: "Portugal", iso: "pt" },
    { nome: "São Tomé e Príncipe", iso: "st" },
    { nome: "Timor-Leste", iso: "tl" },
  ],
};

export const NOTA_REMISSAO_BILATERAIS =
  "Para os demais países participantes da Convenção, a referência segue os organismos de ligação já utilizados nos respectivos acordos bilaterais.";
