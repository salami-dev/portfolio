import type { ProjectStatus } from "@lib/content/types";

export function formatStatus(status: ProjectStatus): string {
  switch (status) {
    case "planned":
      return "Planned";
    case "in-progress":
      return "In progress";
    case "complete":
      return "Complete";
    case "archived":
      return "Archived";
  }
}
