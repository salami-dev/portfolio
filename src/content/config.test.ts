import { describe, expect, it } from "vitest";
import { disciplines, projectStatuses, workFilterDisciplines } from "@lib/content/types";

describe("content invariants", () => {
  it("keeps work filters inside the canonical discipline union", () => {
    expect(workFilterDisciplines.every((discipline) => disciplines.includes(discipline))).toBe(true);
  });

  it("uses explicit project lifecycle statuses", () => {
    expect(projectStatuses).toEqual(["planned", "in-progress", "complete", "archived"]);
  });
});
