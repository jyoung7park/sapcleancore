export type SourceSelection = {
  system: string;
  product: string;
};

const base = "https://raw.githubusercontent.com/SAP/abap-atc-cr-cv-s4hc/main/src";

const releaseFiles: Record<string, Record<string, string>> = {
  "Private Edition": {
    "S/4HANA 2022": "objectReleaseInfo_PCE2022_2.json",
    "S/4HANA 2023": "objectReleaseInfo_PCE2023_3.json",
    "S/4HANA 2025": "objectReleaseInfo_PCE2025_1.json",
  },
  "Public Edition": {
    "S/4HANA 2022": "archive/objectReleaseInfo_2208.json",
    "S/4HANA 2023": "archive/objectReleaseInfo_2308.json",
    "S/4HANA 2025": "objectReleaseInfoLatest.json",
  },
};

export function getSapSourceUrls(selection: SourceSelection) {
  const file = releaseFiles[selection.product]?.[selection.system];
  if (!file) throw new Error("Unsupported SAP source selection");
  return {
    release: `${base}/${file}`,
    classification: `${base}/objectClassifications_SAP.json`,
  };
}

export type SapSourceObject = {
  tadirObject?: string;
  tadirObjName?: string;
  objectType?: string;
  objectKey?: string;
  softwareComponent?: string;
  applicationComponent?: string;
  state?: string;
  successorClassification?: string;
  successorConceptName?: string;
  successors?: Array<string | {
    tadirObject?: string;
    tadirObjName?: string;
    objectType?: string;
    objectKey?: string;
  }>;
  labels?: string[];
};

export function mergeByLevel(releaseItems: SapSourceObject[], classificationItems: SapSourceObject[]) {
  const result = new Map<string, SapSourceObject & { level: "A" | "B" | "C" | "D" }>();
  const key = (item: SapSourceObject) => `${item.objectType ?? item.tadirObject ?? ""}|${item.objectKey ?? item.tadirObjName ?? ""}`;
  for (const item of releaseItems) {
    if (item.state === "released") result.set(key(item), { ...item, level: "A" });
  }
  for (const item of classificationItems) {
    if (item.state === "classicAPI" && !result.has(key(item))) result.set(key(item), { ...item, level: "B" });
  }
  for (const item of releaseItems) {
    if (item.state === "deprecated" && !result.has(key(item))) result.set(key(item), { ...item, level: "D" });
  }
  for (const item of [...releaseItems, ...classificationItems]) {
    if (["notToBeReleased", "notToBeReleasedStable", "noAPI"].includes(item.state ?? "")) {
      const itemKey = key(item);
      const existing = result.get(itemKey);
      if (!existing) {
        result.set(itemKey, { ...item, level: "C" });
      } else if (existing.level === "C") {
        result.set(itemKey, {
          ...existing, ...item,
          objectKey: existing.objectKey ?? item.objectKey,
          successors: existing.successors ?? item.successors,
          successorConceptName: existing.successorConceptName ?? item.successorConceptName,
          labels: item.labels ?? existing.labels,
          level: "C",
        });
      }
    }
  }
  return [...result.values()];
}


export function scoreSapObject(item: SapSourceObject, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const score = (value: string | undefined, exact: number, prefix: number, contains: number) => {
    const normalized = value?.toLowerCase() ?? "";
    return normalized === q ? exact : normalized.startsWith(q) ? prefix : normalized.includes(q) ? contains : 0;
  };
  let result = 0;
  result = Math.max(result, score(item.objectKey, 1000, 900, 800));
  result = Math.max(result, score(item.tadirObjName, 750, 650, 550));
  result = Math.max(result, score(item.objectType, 500, 400, 300));
  result = Math.max(result, score(item.applicationComponent, 450, 350, 250));
  result = Math.max(result, score(item.softwareComponent, 425, 325, 225));
  result = Math.max(result, score(item.successorConceptName, 400, 300, 200));
  for (const successor of item.successors ?? []) {
    const value = typeof successor === "string" ? successor : successor.objectKey ?? successor.tadirObjName;
    result = Math.max(result, score(value, 375, 275, 175));
  }
  return result;
}
