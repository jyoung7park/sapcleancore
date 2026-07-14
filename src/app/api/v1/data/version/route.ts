import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ source: "SAP Cloudification Repository", release: "PCE 2025", importedAt: "2026-07-14T03:00:00Z", mode: "DEMO" });
}
