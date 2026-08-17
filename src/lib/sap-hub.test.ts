import { describe, expect, it } from "vitest";
import { getSapHubSearchUrl, isReleasedObject } from "./sap-hub";

describe("getSapHubSearchUrl", () => {
  it("builds the SAP Business Accelerator Hub search url for an object key", () => {
    expect(getSapHubSearchUrl("I_HOUSEBANK")).toBe("https://hub.sap.com/search?searchterm=I_HOUSEBANK&tab=All&refinedBy=true");
  });

  it("encodes object keys that contain url characters", () => {
    expect(getSapHubSearchUrl("BAPI SALES/ORDER")).toBe("https://hub.sap.com/search?searchterm=BAPI%20SALES%2FORDER&tab=All&refinedBy=true");
  });
});

describe("isReleasedObject", () => {
  it("is true for objects released by SAP", () => {
    expect(isReleasedObject({ state: "RELEASED", rawState: "released" })).toBe(true);
    expect(isReleasedObject({ state: "RELEASED" })).toBe(true);
  });

  it("is false for classic, internal and deprecated objects", () => {
    expect(isReleasedObject({ state: "CLASSIC_API", rawState: "classicAPI" })).toBe(false);
    expect(isReleasedObject({ state: "INTERNAL", rawState: "notToBeReleased" })).toBe(false);
    expect(isReleasedObject({ state: "DEPRECATED", rawState: "deprecated" })).toBe(false);
  });

  it("trusts the SAP raw state over the derived state", () => {
    expect(isReleasedObject({ state: "RELEASED", rawState: "deprecated" })).toBe(false);
  });
});
