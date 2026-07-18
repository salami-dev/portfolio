import type { CollectionEntry } from "astro:content";

const expectedFeaturedProjectCount = 3;

export type ProjectPortfolio = {
  featured: CollectionEntry<"projects">[];
  supporting: CollectionEntry<"projects">[];
};

export function buildProjectPortfolio(projects: CollectionEntry<"projects">[]): ProjectPortfolio {
  if (projects.length === 0) {
    throw new Error("The projects collection is empty. Refusing to render an empty portfolio.");
  }

  const sortedProjects = [...projects].sort((a, b) => a.data.displayOrder - b.data.displayOrder);
  const featured = sortedProjects.filter((project) => project.data.featured);

  if (featured.length !== expectedFeaturedProjectCount) {
    throw new Error(`Expected ${expectedFeaturedProjectCount} featured projects, received ${featured.length}.`);
  }

  return {
    featured,
    supporting: sortedProjects.filter((project) => !project.data.featured)
  };
}
