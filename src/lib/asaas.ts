/**
 * Helpers de integração com o Asaas (Checkout).
 * Docs: https://docs.asaas.com/reference/criar-novo-checkout
 */

export function asaasIsProduction(): boolean {
  return (process.env.ASAAS_ENV || "sandbox").toLowerCase() === "production";
}

export function asaasApiBase(): string {
  return asaasIsProduction()
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";
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

function headers(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    access_token: token,
    "User-Agent": "NegociAi",
  };
}

export interface CreateCheckoutParams {
  value: number;
  externalReference: string;
  successUrl: string;
  cancelUrl: string;
  expiredUrl: string;
}

export async function createCheckout(
  token: string,
  params: CreateCheckoutParams,
): Promise<{ id: string }> {
  const res = await fetch(`${asaasApiBase()}/checkouts`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      billingTypes: ["PIX", "CREDIT_CARD"],
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
          name: "NegociAí — Sistema de negociação para WhatsApp",
          description:
            "Acesso ao gerador de respostas prontas para WhatsApp Business.",
          quantity: 1,
          value: params.value,
        },
      ],
    }),
  });

  const data = (await res.json()) as { id?: string };
  if (!res.ok || !data.id) {
    throw new Error(`Asaas checkout falhou: ${res.status} ${JSON.stringify(data)}`);
  }
  return { id: data.id };
}

const PAID_STATUSES = new Set(["PAID", "RECEIVED", "CONFIRMED"]);

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
