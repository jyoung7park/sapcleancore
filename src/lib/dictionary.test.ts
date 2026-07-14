import { describe, expect, it } from "vitest";
import { expandQuery } from "./dictionary";

describe("expandQuery", () => {
  it("expands Korean sales-order terms into SAP object keys", () => {
    const terms = expandQuery("\ud310\ub9e4\uc624\ub354 \uc0dd\uc131");
    expect(terms).toContain("vbak");
    expect(terms).toContain("i_salesorder");
  });

  it("normalizes spaced Korean aliases", () => {
    expect(expandQuery("\uc790\uc7ac \uc774\ub3d9")).toContain("bapi_goodsmvt");
  });

  it("keeps unknown queries unchanged", () => {
    expect(expandQuery("Z_CUSTOM_OBJECT")).toEqual(["z_custom_object"]);
  });
});
