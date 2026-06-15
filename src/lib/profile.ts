import type { FormData, Tom } from "@/lib/types";

export interface UserProfile extends FormData {
  email?: string;
  hasPaid: boolean;
}

export const EMPTY_PROFILE: UserProfile = {
  nome: "",
  profissao: "",
  servicos: "",
  preco: "",
  diferenciais: "",
  objecoes: "",
  tom: "Profissional",
  hasPaid: false,
};

export function profileFromRow(row: Record<string, unknown>): UserProfile {
  const tom = String(row.tone ?? "Profissional") as Tom;
  return {
    email: row.email ? String(row.email) : undefined,
    nome: String(row.business_name ?? ""),
    profissao: String(row.profession ?? ""),
    servicos: String(row.services ?? ""),
    preco: String(row.price_range ?? ""),
    diferenciais: String(row.differentials ?? ""),
    objecoes: String(row.objections ?? ""),
    tom: ["Formal", "Profissional", "Amigável", "Premium"].includes(tom)
      ? tom
      : "Profissional",
    hasPaid: Boolean(row.has_paid),
  };
}

export function profileToRow(form: FormData, email?: string) {
  return {
    email,
    business_name: form.nome,
    profession: form.profissao,
    services: form.servicos,
    price_range: form.preco,
    differentials: form.diferenciais,
    objections: form.objecoes,
    tone: form.tom,
    updated_at: new Date().toISOString(),
  };
}
