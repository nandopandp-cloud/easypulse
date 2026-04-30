import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check env vars (never expose values)
  checks.AUTH_SECRET = process.env.AUTH_SECRET
    ? `set (${process.env.AUTH_SECRET.length} chars)`
    : "MISSING";
  checks.DATABASE_URL = process.env.DATABASE_URL ? "set" : "MISSING";
  checks.NODE_ENV = process.env.NODE_ENV ?? "undefined";

  // Check DB connectivity
  try {
    const { PrismaClient } = await import("@prisma/client");
    const p = new PrismaClient();
    await p.$queryRaw`SELECT 1`;
    await p.$disconnect();
    checks.database = "connected";
  } catch (e) {
    checks.database = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  const allOk = !Object.values(checks).some((v) => v.startsWith("MISSING") || v.startsWith("error"));

  return NextResponse.json(
    { ok: allOk, checks, ts: new Date().toISOString() },
    { status: allOk ? 200 : 500 },
  );
}
