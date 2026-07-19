import type { Discipline, WorkFilterDiscipline } from "@lib/content/types";

export type WorkFilterProject = {
  title: string;
  slug: string;
  context: string;
  contribution: string;
  impact: string;
  disciplines: Discipline[];
  complexity: string;
};

export type FilterValue = "All" | WorkFilterDiscipline;
