export type CleanCoreLevel = "A" | "B" | "C" | "D";
export type ReleaseState = "RELEASED" | "CLASSIC_API" | "INTERNAL" | "NOT_RECOMMENDED" | "DEPRECATED";

export interface Successor {
  name: string;
  type: string;
  level: CleanCoreLevel;
  purpose: string;
  capability: string;
  scope: "Local API" | "Remote API";
  rap: boolean;
}

export interface SapObject {
  objectKey: string;
  objectName: string;
  objectType: string;
  tadirObject: string;
  tadirObjName: string;
  descriptionEn: string;
  descriptionKo: string;
  state: ReleaseState;
  rawState?: string;
  level: CleanCoreLevel;
  product: string;
  release: string;
  softwareComponent: string;
  packageName: string;
  applicationComponent: string;
  warning: string;
  successors: Successor[];
  releaseHistory: Record<string, ReleaseState | "NOT_AVAILABLE">;
}
