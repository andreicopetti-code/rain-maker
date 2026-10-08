import type { OrgUfAccess } from '@/lib/billing/org-uf-access';

export type EmpresaPreview = {
  cnpj: string;
  razao_social: string | null;
  nome_fantasia: string | null;
  situacao: string | null;
  cidade: string | null;
  estado: string | null;
  regime_tributario: string | null;
  regime_historico: string | null;
};

export type EmpresaDetail = EmpresaPreview & {
  endereco: string | null;
  bairro: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
  cnae_codigo: string | null;
  cnae_descricao: string | null;
  porte: string | null;
  faturamento_est: string | null;
  funcionarios: string | null;
  data_inicio: string | null;
  socios: string | null;
  segmento: string | null;
};

export type CnpjUsage = {
  used: number;
  limit: number;
  remaining: number;
  periodKind?: 'daily' | 'monthly';
};

export type CnpjHistoryItem = {
  id: string;
  cnpj: string;
  created_at: string;
  razao_social: string | null;
};

export type { OrgUfAccess };
