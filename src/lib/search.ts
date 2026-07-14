import { objects } from "@/lib/data";
import { expandQuery } from "@/lib/dictionary";
import type { SapObject } from "@/types/object";

export function searchObjects(query: string, level?: string) {
  const terms = expandQuery(query);
  const scored = objects.map((object) => ({ object, score: scoreObject(object, query, terms) }))
    .filter(({ object, score }) => score > 0 && (!level || level === "ALL" || object.level === level))
    .sort((a, b) => b.score - a.score);
  return { expandedTerms: terms.slice(1), items: scored.map(({ object }) => object) };
}

function scoreObject(object: SapObject, query: string, terms: string[]) {
  const q = query.trim().toUpperCase();
  const key = object.objectKey.toUpperCase();
  if (!q) return 1;
  let score = key === q ? 100 : key.startsWith(q) ? 85 : key.includes(q) ? 70 : 0;
  if (object.tadirObjName.toUpperCase() === q) score = Math.max(score, 95);
  const haystack = [object.objectName, object.descriptionEn, object.descriptionKo, object.applicationComponent, ...object.successors.map((s) => s.name)].join(" ").toLowerCase();
  for (const term of terms) if (haystack.includes(term)) score = Math.max(score, term === terms[0] ? 60 : 55);
  if (object.successors.some((s) => s.name.toUpperCase() === q)) score = Math.max(score, 65);
  return score;
}
