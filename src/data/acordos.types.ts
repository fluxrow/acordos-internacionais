// Tipos compartilhados entre src/data/acordos.ts e src/data/acordos.generated.ts.

export interface OrgaoLigacao {
  titulo: string;
  instituicao?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export interface DocumentoImportado {
  nome: string;
  desc?: string;
  cat: string; // principal | complementar | formulario | roteiro | outro
  arquivo?: string;
  tamanho?: string;
}

export interface AcordoImportado {
  titulo?: string;
  instrumento?: string;
  decreto?: string;
  vigorDesde?: string;
  docsInfo?: string;
  orgaoBR?: OrgaoLigacao;
  orgaoParceiro?: OrgaoLigacao;
  beneficios: {
    brasil: string[];
    parceiro: string[];
  };
  acordoTrecho?: string;
  ajusteTrecho?: string;
  documentos: DocumentoImportado[];
}
