import type { ReleaseState } from "@/types/object";

export function getSapHubSearchUrl(objectKey: string) {
  return `https://hub.sap.com/search?searchterm=${encodeURIComponent(objectKey)}&tab=All&refinedBy=true`;
}

export function isReleasedObject({ state, rawState }: { state: ReleaseState; rawState?: string }) {
  if (rawState) return rawState.toLowerCase() === "released";
  return state === "RELEASED";
}
