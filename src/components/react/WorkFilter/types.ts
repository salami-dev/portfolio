import type { Discipline, ProjectStatus, WorkFilterDiscipline } from "@lib/content/types";

export type WorkFilterProject = {
  title: string;
  slug: string;
  thesis: string;
  disciplines: Discipline[];
  status: ProjectStatus;
  complexity: string;
};

export type FilterValue = "All" | WorkFilterDiscipline;
