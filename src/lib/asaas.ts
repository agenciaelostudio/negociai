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

export function headers(token: string): HeadersInit {
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
 * Busca pagamentos recentes no Asaas pelo email do cliente.
 * 1. Encontra o customer ID pelo email (/customers)
 * 2. Busca payments desse customer nos últimos N dias (/payments)
 * 3. Retorna o primeiro pago
 */
export async function findRecentPaidCheckouts(
  token: string,
  email: string,
  hoursBack = 72,
): Promise<{ ref: string; id: string } | null> {
  const base = asaasApiBase();
  const h = headers(token);

  // 1. Busca customer pelo email
  try {
    const custRes = await fetch(
      `${base}/customers?email=${encodeURIComponent(email)}`,
      { headers: h, cache: "no-store" },
    );
    if (!custRes.ok) return null;
    const custData = (await custRes.json()) as { data?: Array<{ id: string }> };
    const customers = Array.isArray(custData.data) ? custData.data : [];
    if (customers.length === 0) return null;

    const customerId = customers[0].id;

    // 2. Busca payments desse customer nas últimas horas
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
    const payRes = await fetch(
      `${base}/payments?customer=${customerId}&dateCreated[ge]=${encodeURIComponent(since)}&limit=20`,
      { headers: h, cache: "no-store" },
    );
    if (!payRes.ok) return null;
    const payData = (await payRes.json()) as {
      data?: Array<{ id: string; externalReference?: string; status: string }>;
    };
    const payments = Array.isArray(payData.data) ? payData.data : [];

    for (const payment of payments) {
      if (!payment.status || !PAID_STATUSES.has(payment.status.toUpperCase())) continue;
      if (!payment.externalReference) continue;
      return { ref: payment.externalReference, id: payment.id };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Consulta um pagamento (payment) no Asaas pelo externalReference.
 * Usamos /payments (não /checkouts, que não tem leitura).
 */
export async function isCheckoutPaidByRef(
  token: string,
  externalReference: string,
): Promise<boolean> {
  const url = `${asaasApiBase()}/payments?externalReference=${encodeURIComponent(
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
