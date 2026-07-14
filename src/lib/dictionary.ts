export type KoreanBusinessTerm = {
  aliases: string[];
  searchTerms: string[];
};

export const koreanBusinessTerms: Record<string, KoreanBusinessTerm> = {
  "\ud310\ub9e4\uc624\ub354": { aliases: ["\ud310\ub9e4 \uc624\ub354", "\ud310\ub9e4\uc8fc\ubb38", "\uc218\uc8fc", "\uc601\uc5c5\uc8fc\ubb38"], searchTerms: ["sales order", "sales document", "VBAK", "VBAP", "I_SALESORDER", "SD-SLS"] },
  "\uad6c\ub9e4\uc624\ub354": { aliases: ["\uad6c\ub9e4 \uc624\ub354", "\uad6c\ub9e4\uc8fc\ubb38", "\ubc1c\uc8fc", "PO"], searchTerms: ["purchase order", "purchasing document", "EKKO", "EKPO", "BAPI_PO", "MM-PUR"] },
  "\uc790\uc7ac\uc774\ub3d9": { aliases: ["\uc790\uc7ac \uc774\ub3d9", "\uc7ac\uace0\uc774\ub3d9", "\uc785\uace0", "\ucd9c\uace0"], searchTerms: ["goods movement", "material document", "BAPI_GOODSMVT", "MKPF", "MSEG", "MM-IM"] },
  "\ud68c\uacc4\uc804\ud45c": { aliases: ["\ud68c\uacc4 \uc804\ud45c", "\uc804\ud45c", "\ubd84\uac1c", "\uc77c\ubc18\uc6d0\uc7a5"], searchTerms: ["accounting document", "journal entry", "BAPI_ACC", "BKPF", "BSEG", "FI-GL"] },
  "\uc804\uc790\uc138\uae08\uacc4\uc0b0\uc11c": { aliases: ["\uc138\uae08\uacc4\uc0b0\uc11c", "\uc804\uc790 \uc138\uae08\uacc4\uc0b0\uc11c"], searchTerms: ["electronic invoice", "billing document", "EDOCUMENT", "FI-LOC"] },
  "\uc0dd\uc0b0\uc624\ub354": { aliases: ["\uc0dd\uc0b0 \uc624\ub354", "\uc0dd\uc0b0\uc9c0\uc2dc", "\uc81c\uc870\uc624\ub354"], searchTerms: ["production order", "manufacturing order", "AUFK", "AFKO", "PP-SFC"] },
  "\uc790\uc7ac\ub9c8\uc2a4\ud130": { aliases: ["\uc790\uc7ac \ub9c8\uc2a4\ud130", "\ud488\ubaa9", "\uc790\uc7ac"], searchTerms: ["material master", "product master", "MARA", "MARC", "I_PRODUCT", "LO-MD-MM"] },
  "\uace0\uac1d\ub9c8\uc2a4\ud130": { aliases: ["\uace0\uac1d \ub9c8\uc2a4\ud130", "\uace0\uac1d", "\uac70\ub798\ucc98"], searchTerms: ["customer master", "business partner", "KNA1", "BUT000", "I_BUSINESSPARTNER"] },
  "\uba54\uc77c": { aliases: ["\uc774\uba54\uc77c", "\uba54\uc77c\ubc1c\uc1a1", "\uc804\uc790\uc6b0\ud3b8"], searchTerms: ["mail", "email", "business communication", "BCS", "CL_BCS", "SMTP", "BC-SRV-COM"] },
  "\ud30c\uc77c": { aliases: ["\ud30c\uc77c\uc5c5\ub85c\ub4dc", "\ud30c\uc77c\ub2e4\uc6b4\ub85c\ub4dc", "\uc11c\ubc84\ud30c\uc77c"], searchTerms: ["file", "dataset", "stream", "OPEN DATASET", "GUI_UPLOAD"] },
  "\uad6c\ub9e4\uc694\uccad": { aliases: ["\uad6c\ub9e4 \uc694\uccad", "\uad6c\ub9e4\uc694\uad6c", "PR"], searchTerms: ["purchase requisition", "BANF", "EBAN", "MM-PUR"] },
  "\uc218\uc694\uc608\uce21": { aliases: ["\uc218\uc694 \uc608\uce21", "\uc608\uce21", "\uc218\uc694\uacc4\ud68d"], searchTerms: ["demand forecast", "planned independent requirement", "PBIM", "PBED", "PP-MP"] }
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export function expandQuery(query: string) {
  const original = query.trim().toLowerCase();
  const normalized = normalize(query);
  const expanded = new Set<string>([original]);
  for (const [primary, entry] of Object.entries(koreanBusinessTerms)) {
    const names = [primary, ...entry.aliases];
    if (names.some((name) => normalized.includes(normalize(name)))) {
      expanded.add(primary.toLowerCase());
      entry.aliases.forEach((value) => expanded.add(value.toLowerCase()));
      entry.searchTerms.forEach((value) => expanded.add(value.toLowerCase()));
    }
  }
  return [...expanded];
}


export function getKoreanKeywordDetails(item: {
  objectKey?: string;
  tadirObjName?: string;
  objectType?: string;
  applicationComponent?: string;
  softwareComponent?: string;
  successorConceptName?: string;
  successors?: Array<string | { objectKey?: string; tadirObjName?: string }>;
}) {
  const searchable = [
    item.objectKey, item.tadirObjName, item.objectType, item.applicationComponent,
    item.softwareComponent, item.successorConceptName,
    ...(item.successors ?? []).map((value) => typeof value === "string" ? value : value.objectKey ?? value.tadirObjName),
  ].filter(Boolean).map((value) => normalize(String(value)));

  const details: string[] = [];
  for (const [primary, entry] of Object.entries(koreanBusinessTerms)) {
    const matched = entry.searchTerms.filter((term) => {
      const normalizedTerm = normalize(term);
      return searchable.some((value) => value.includes(normalizedTerm) || normalizedTerm.includes(value));
    });
    if (matched.length) {
      details.push(`\ub300\ud45c\uc5b4: ${primary} | \ub3d9\uc758\uc5b4: ${entry.aliases.join(", ")} | SAP \ub9e4\uce6d: ${matched.join(", ")}`);
    }
  }
  return details.join(" / ") || "N/A";
}
