import { NextRequest, NextResponse } from "next/server";
import { searchObjects } from "@/lib/search";

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const level = request.nextUrl.searchParams.get("level") ?? undefined;
  const result = searchObjects(q, level);
  return NextResponse.json({ query: q, product: "PCE", release: "2025", ...result });
}
