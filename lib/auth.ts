export const SESSION_COOKIE = "jaski_session";

const encoder = new TextEncoder();
const REMEMBER_SECONDS = 60 * 60 * 24 * 90;
const SESSION_SECONDS = 60 * 60 * 24;

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeHexEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmac(value: string) {
  const secret = process.env.JASKI_SESSION_SECRET;
  if (!secret) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return toHex(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  );
}

async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(value))
  );
}

export async function passwordMatches(candidate: string) {
  const expected = process.env.JASKI_PASSWORD;
  if (!expected) return false;

  const [a, b] = await Promise.all([digest(candidate), digest(expected)]);

  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
}

export async function createSessionToken(remember: boolean) {
  const seconds = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const expires = Math.floor(Date.now() / 1000) + seconds;
  const mode = remember ? "remember" : "session";
  const payload = `${expires}.${mode}`;
  const signature = await hmac(payload);

  if (!signature) {
    throw new Error("JASKI_SESSION_SECRET is not configured");
  }

  return {
    token: `${payload}.${signature}`,
    maxAge: remember ? REMEMBER_SECONDS : undefined,
  };
}

export async function verifySessionToken(token?: string | null) {
  if (!token) return false;

  const [expiresRaw, mode, signature, ...extra] = token.split(".");
  if (extra.length || !expiresRaw || !mode || !signature) return false;
  if (mode !== "remember" && mode !== "session") return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires)) return false;
  if (expires <= Math.floor(Date.now() / 1000)) return false;

  const payload = `${expiresRaw}.${mode}`;
  const expected = await hmac(payload);

  return Boolean(expected) && constantTimeHexEqual(signature, expected);
}
