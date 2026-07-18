import { describe, expect, it } from "vitest";
import { canonicalPath, notePath, workPath } from "./urls";

describe("route helpers", () => {
  it("normalizes canonical paths with trailing slashes", () => {
    expect(canonicalPath("/work")).toBe("/work/");
    expect(canonicalPath("/")).toBe("/");
  });

  it("builds content paths from slugs", () => {
    expect(workPath("system-topology-viewer")).toBe("/work/system-topology-viewer/");
    expect(notePath("failure-states-users-understand")).toBe("/notes/failure-states-users-understand/");
  });
});
