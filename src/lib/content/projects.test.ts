import { describe, expect, it } from "vitest";
import { buildProjectPortfolio } from "./projects";
import type { CollectionEntry } from "astro:content";

function project(slug: string, featured: boolean, displayOrder: number): CollectionEntry<"projects"> {
  return {
    id: slug,
    collection: "projects",
    data: { slug, featured, displayOrder }
  } as CollectionEntry<"projects">;
}

describe("buildProjectPortfolio", () => {
  it("refuses to render an empty project collection", () => {
    expect(() => buildProjectPortfolio([])).toThrow("projects collection is empty");
  });

  it("requires exactly three featured projects", () => {
    expect(() => buildProjectPortfolio([project("one", true, 1)])).toThrow("Expected 3 featured projects");
  });

  it("sorts and separates featured and supporting projects", () => {
    const portfolio = buildProjectPortfolio([
      project("supporting", false, 4),
      project("third", true, 3),
      project("first", true, 1),
      project("second", true, 2)
    ]);

    expect(portfolio.featured.map(({ data }) => data.slug)).toEqual(["first", "second", "third"]);
    expect(portfolio.supporting.map(({ data }) => data.slug)).toEqual(["supporting"]);
  });
});
