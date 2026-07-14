import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSapSourceUrls, mergeByLevel, type SapSourceObject } from "@/lib/sap-sources";

async function loadJson(url: string, key: "objectReleaseInfo" | "objectClassifications") {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`SAP source request failed: ${response.status}`);
  const data = await response.json();
  return data[key] as SapSourceObject[];
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const level = request.nextUrl.searchParams.get("level") ?? "ALL";
  const system = request.nextUrl.searchParams.get("system") ?? "S/4HANA 2025";
  const product = request.nextUrl.searchParams.get("product") ?? "Private Edition";
  try {
    const urls = getSapSourceUrls({ system, product });
    const [releaseItems, classificationItems] = await Promise.all([
      loadJson(urls.release, "objectReleaseInfo"),
      loadJson(urls.classification, "objectClassifications"),
    ]);
    const all = mergeByLevel(releaseItems, classificationItems);
    const filtered = all.filter((item) => {
      if (level !== "ALL" && item.level !== level) return false;
      if (!q) return true;
      return [item.objectKey, item.tadirObjName, item.objectType, item.applicationComponent, item.softwareComponent, item.successorConceptName]
        .some((value) => value?.toLowerCase().includes(q));
    }).slice(0, 200);
    const items = filtered.map((item) => ({
      objectKey: item.objectKey ?? item.tadirObjName ?? "",
      objectName: item.objectKey ?? item.tadirObjName ?? "",
      objectType: item.objectType ?? item.tadirObject ?? "",
      tadirObject: item.tadirObject ?? "",
      tadirObjName: item.tadirObjName ?? "",
      descriptionEn: `SAP state: ${(item.state ?? "unknown").replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase())}`,
      descriptionKo: `${product} / ${system}`,
      state: item.level === "A" ? "RELEASED" : item.level === "B" ? "CLASSIC_API" : "INTERNAL",
      level: item.level,
      product: product === "Private Edition" ? "PCE" : "Public",
      release: system.replace("S/4HANA ", ""),
      softwareComponent: item.softwareComponent ?? "",
      packageName: "",
      applicationComponent: item.applicationComponent ?? "",
      warning: item.level === "C" ? "Released API conversion should be reviewed." : "Verify the API state in the target system.",
      successors: (item.successors ?? []).map((successor) => {
        const value = typeof successor === "string" ? { objectKey: successor } : successor;
        return { name: value.objectKey ?? value.tadirObjName ?? "Unknown", type: value.objectType ?? value.tadirObject ?? "Object", level: "A", purpose: "SAP official successor", capability: "Reference", scope: "SAP Repository", rap: false };
      }),
      releaseHistory: { [system.replace("S/4HANA ", "")]: item.state ?? "UNKNOWN" },
    }));
    return NextResponse.json({ query: q, product, release: system, total: all.length, counts: { A: all.filter((item) => item.level === "A").length, B: all.filter((item) => item.level === "B").length, C: all.filter((item) => item.level === "C").length }, items, expandedTerms: [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 502 });
  }
}
