import type { CleanCoreLevel, ReleaseState } from "@/types/object";

const labels: Record<ReleaseState, string> = {
  RELEASED: "Released API", CLASSIC_API: "Classic API", INTERNAL: "Internal", NOT_RECOMMENDED: "Not recommended", DEPRECATED: "Deprecated"
};

export function StatusBadge({ state, level }: { state: ReleaseState; level: CleanCoreLevel }) {
  return <span className={`status status-${level.toLowerCase()}`}><i />{labels[state]} <b>Level {level}</b></span>;
}
