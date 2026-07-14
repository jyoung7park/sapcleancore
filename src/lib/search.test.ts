import { describe, expect, it } from "vitest";
import { searchObjects } from "./search";

describe("searchObjects", () => {
  it("prioritizes exact objectKey matches", () => expect(searchObjects("VBAK").items[0]?.objectKey).toBe("VBAK"));
  it("expands Korean business terms", () => expect(searchObjects("판매오더 생성").items.map((item) => item.objectKey)).toContain("I_SALESORDER"));
  it("finds TADIR object names", () => expect(searchObjects("MB_BUS2017").items[0]?.objectKey).toBe("BAPI_GOODSMVT_CREATE"));
});
