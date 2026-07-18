export const disciplines = [
  "Interface Engineering",
  "Frontend Engineering",
  "Backend Systems",
  "Backend Architecture",
  "Backend Services",
  "Data Engineering",
  "Health Data",
  "Cloud Infrastructure",
  "Cloud Delivery",
  "Reliability",
  "Performance",
  "Security",
  "Architecture",
  "Product Systems",
  "Backend and Workflows",
  "Data and Computation",
  "Cloud and Operations",
  "Reliability and Performance",
  "Product Design",
  "Platform Engineering",
  "Domain Modelling",
  "Payments"
] as const;

export type Discipline = (typeof disciplines)[number];

export const projectStatuses = ["planned", "in-progress", "complete", "archived"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const workFilterDisciplines = [
  "Interface Engineering",
  "Backend Systems",
  "Data Engineering",
  "Cloud Infrastructure",
  "Reliability",
  "Performance",
  "Security",
  "Architecture"
] as const satisfies readonly Discipline[];

export type WorkFilterDiscipline = (typeof workFilterDisciplines)[number];
