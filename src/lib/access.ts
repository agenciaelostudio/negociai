import crypto from "crypto";

/**
 * Controle de acesso pago.
 *
 * Regra: o gerador só é "destravado" quando o pagamento está habilitado
 * (ASAAS_API_KEY presente). Nesse caso, é preciso um cookie de acesso assinado
 * (HMAC), emitido apenas após a confirmação do pagamento no Asaas.
 *
 * Sem ASAAS_API_KEY (modo demo/desenvolvimento) o acesso é liberado.
 */

export const ACCESS_COOKIE = "negociai_access";

const SECRET = process.env.ACCESS_SECRET || "negociai-dev-secret-change-me";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export function paymentsEnabled(): boolean {
  return Boolean(process.env.ASAAS_API_KEY);
}

export function createAccessToken(): string {
  const exp = String(Date.now() + TTL_MS);
  const sig = crypto.createHmac("sha256", SECRET).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifyAccessToken(token?: string | null): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(exp).digest("hex");
  if (sig.length !== expected.length) return false;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return false;
    }
  } catch {
    return false;
  }
  const expNum = Number(exp);
  return Number.isFinite(expNum) && Date.now() < expNum;
}

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: Math.floor(TTL_MS / 1000),
};
