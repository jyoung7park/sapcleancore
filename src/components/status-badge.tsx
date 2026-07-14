import type { CleanCoreLevel, ReleaseState } from "@/types/object";

const labels: Record<ReleaseState, string> = {
  RELEASED: "Released", CLASSIC_API: "Classic API", INTERNAL: "Internal", NOT_RECOMMENDED: "Not To Be Released", DEPRECATED: "Deprecated"
};

function statusMeta(state: ReleaseState, rawState?: string) {
  const raw = rawState?.toLowerCase();
  if (raw === "released" || raw === "classicapi" || state === "RELEASED" || state === "CLASSIC_API") return { label: raw === "classicapi" || state === "CLASSIC_API" ? "Classic API" : "Released", tone: "positive" };
  if (raw === "nottobereleased" || raw === "nottobereleasedstable" || state === "NOT_RECOMMENDED") return { label: "Not To Be Released", tone: "warning" };
  if (raw === "deprecated" || state === "DEPRECATED") return { label: "Deprecated", tone: "danger" };
  if (raw === "noapi") return { label: "No API", tone: "danger" };
  return { label: labels[state], tone: "neutral" };
}

export function StatusBadge({ state, level, rawState }: { state: ReleaseState; level: CleanCoreLevel; rawState?: string }) {
  const meta = statusMeta(state, rawState);
  return <span className={`status status-${meta.tone}`}><i />{meta.label} <b>Level {level}</b></span>;
}
