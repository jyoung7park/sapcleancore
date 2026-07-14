import { describe, expect, it } from "vitest";
import { mergeByLevel } from "./sap-sources";

describe("mergeByLevel", () => {
  it("keeps different function modules in the same function group", () => {
    const release = [{ objectType: "FUNC", objectKey: "SD_VBAK_SINGLE_READ", tadirObject: "FUGR", tadirObjName: "V45I", state: "notToBeReleased" }];
    const classifications = [{ objectType: "FUNC", objectKey: "OTHER_FUNCTION", tadirObject: "FUGR", tadirObjName: "V45I", state: "classicAPI" }];
    const result = mergeByLevel(release, classifications);
    expect(result).toHaveLength(2);
    expect(result.find((item) => item.objectKey === "SD_VBAK_SINGLE_READ")?.level).toBe("C");
    expect(result.find((item) => item.objectKey === "OTHER_FUNCTION")?.level).toBe("B");
  });
});
