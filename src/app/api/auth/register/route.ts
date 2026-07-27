import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-utils";
import { createUser, getUserByEmail } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "").trim();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  createUser({ name, email, password: hashedPassword });

  return NextResponse.json({ ok: true });
}
