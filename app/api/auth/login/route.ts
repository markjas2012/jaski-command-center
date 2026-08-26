import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  passwordMatches,
  SESSION_COOKIE,
} from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!process.env.JASKI_PASSWORD || !process.env.JASKI_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Site authentication is not configured." },
      { status: 500 }
    );
  }

  let body: { password?: unknown; remember?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password =
    typeof body.password === "string" ? body.password : "";

  if (!password || !(await passwordMatches(password))) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 }
    );
  }

  const remember = body.remember === true;
  const session = await createSessionToken(remember);

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(session.maxAge ? { maxAge: session.maxAge } : {}),
  });

  return response;
}
