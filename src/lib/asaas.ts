/**
 * Helpers de integração com o Asaas (Checkout).
 * Docs: https://docs.asaas.com/reference/criar-novo-checkout
 */

/** Detecta ambiente pela chave ($aact_prod_ = produção, $aact_hmlg_ = sandbox). */
export function asaasIsProduction(): boolean {
  const key = process.env.ASAAS_API_KEY || "";
  if (key.includes("_prod_")) return true;
  if (key.includes("_hmlg_") || key.includes("_sandbox_")) return false;
  return (process.env.ASAAS_ENV || "sandbox").toLowerCase() === "production";
}

export function asaasApiBase(): string {
  return asaasIsProduction()
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";
}

/** Host onde o cliente abre a tela de checkout. */
export function asaasCheckoutHost(): string {
  return asaasIsProduction()
    ? "https://www.asaas.com"
    : "https://sandbox.asaas.com";
}

export function asaasCheckoutUrl(id: string): string {
  return `${asaasCheckoutHost()}/checkoutSession/show?id=${id}`;
}

function sanitizeToken(token: string): string {
  return token.replace(/^\uFEFF/, "").trim().replace(/^["']|["']$/g, "");
}

function headers(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    access_token: sanitizeToken(token),
    "User-Agent": "NegociAi",
  };
}

/** Converte preço BR (19,90) ou US (19.90) para número. */
export function parsePriceBrl(raw?: string): number {
  const normalized = (raw || "19.90").replace(/^\uFEFF/, "").trim().replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? n : 19.9;
}

/** PNG 1x1 transparente (obrigatório no checkout Asaas). */
const PLACEHOLDER_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export interface CreateCheckoutParams {
  value: number;
  externalReference: string;
  successUrl: string;
  cancelUrl: string;
  expiredUrl: string;
}

async function postCheckout(
  token: string,
  params: CreateCheckoutParams,
  billingTypes: string[],
): Promise<Response> {
  return fetch(`${asaasApiBase()}/checkouts`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      billingTypes,
      chargeTypes: ["DETACHED"],
      minutesToExpire: 60,
      externalReference: params.externalReference,
      callback: {
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        expiredUrl: params.expiredUrl,
      },
      items: [
        {
          name: "NegociAi - Acesso completo",
          description: "Sistema de respostas para WhatsApp Business.",
          imageBase64: PLACEHOLDER_IMAGE_BASE64,
          quantity: 1,
          value: params.value,
        },
      ],
    }),
  });
}

function checkoutErrorDetail(data: {
  errors?: Array<{ code?: string; description?: string }>;
}): string {
  return (
    data.errors?.map((e) => e.description || e.code).filter(Boolean).join("; ") ||
    JSON.stringify(data)
  );
}

export async function createCheckout(
  token: string,
  params: CreateCheckoutParams,
): Promise<{ id: string; link?: string }> {
  const billingAttempts: string[][] = [
    ["PIX", "CREDIT_CARD"],
    ["CREDIT_CARD"],
  ];

  let lastDetail = "";
  for (const billingTypes of billingAttempts) {
    const res = await postCheckout(token, params, billingTypes);
    const data = (await res.json()) as {
      id?: string;
      link?: string;
      errors?: Array<{ code?: string; description?: string }>;
    };
    if (res.ok && data.id) {
      return { id: data.id, link: data.link };
    }
    lastDetail = checkoutErrorDetail(data);
    const pixKeyMissing =
      res.status === 400 &&
      lastDetail.toLowerCase().includes("chave pix");
    if (!pixKeyMissing || billingTypes.length === 1) {
      throw new Error(`Asaas checkout falhou: ${res.status} ${lastDetail}`);
    }
  }

  throw new Error(`Asaas checkout falhou: ${lastDetail}`);
}

const PAID_STATUSES = new Set(["PAID", "RECEIVED", "CONFIRMED"]);

interface AsaasCheckout {
  id: string;
  externalReference?: string;
  status: string;
  email?: string;
  customer?: string;
  value?: number;
  dateCreated?: string;
}

/**
 * Consulta checkouts recentes do Asaas (últimas N horas).
 * Usado pelo /api/unlock como fallback quando nenhum checkout
 * pendente é encontrado no banco local.
 */
export async function findRecentPaidCheckouts(
  token: string,
  email: string,
  hoursBack = 48,
): Promise<{ ref: string; id: string } | null> {
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  const url = `${asaasApiBase()}/checkouts?dateCreated[ge]=${encodeURIComponent(since)}&limit=20`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as { data?: AsaasCheckout[] };
  const list = Array.isArray(data.data) ? data.data : [];

  for (const checkout of list) {
    if (!checkout.status || !PAID_STATUSES.has(checkout.status.toUpperCase())) continue;
    if (!checkout.externalReference) continue;
    // Verifica se o email do comprador corresponde
    if (checkout.email?.toLowerCase().trim() === email.toLowerCase().trim()) {
      return { ref: checkout.externalReference, id: checkout.id };
    }
  }

  return null;
}

/**
 * Consulta os checkouts por externalReference e indica se algum já foi pago.
 * Usamos o externalReference (gerado por nós) porque ele é conhecido antes de
 * criar o checkout, permitindo montar a successUrl de retorno.
 */
export async function isCheckoutPaidByRef(
  token: string,
  externalReference: string,
): Promise<boolean> {
  const url = `${asaasApiBase()}/checkouts?externalReference=${encodeURIComponent(
    externalReference,
  )}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) return false;
  const data = (await res.json()) as { data?: Array<{ status?: string }> };
  const list = Array.isArray(data.data) ? data.data : [];
  return list.some(
    (c) => c.status && PAID_STATUSES.has(c.status.toUpperCase()),
  );
}
