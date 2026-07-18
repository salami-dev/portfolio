import { useMemo, useState } from "react";
import { workFilterDisciplines } from "@lib/content/types";
import type { WorkFilterDiscipline } from "@lib/content/types";
import styles from "./WorkFilter.module.css";
import type { FilterValue, WorkFilterProject } from "./types";

type Props = {
  projects: WorkFilterProject[];
};

const allFilter: FilterValue = "All";

function isDisciplineFilter(filter: FilterValue): filter is WorkFilterDiscipline {
  return filter !== allFilter;
}

export function WorkFilter({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>(allFilter);

  const visibleProjects = useMemo(() => {
    if (!isDisciplineFilter(activeFilter)) {
      return projects;
    }

    return projects.filter((project) => project.disciplines.includes(activeFilter));
  }, [activeFilter, projects]);

  return (
    <section className={styles.shell} aria-labelledby="work-list-heading">
      <fieldset className={styles.controls}>
        <legend className={styles.legend}>Filter by discipline</legend>
        {[allFilter, ...workFilterDisciplines].map((discipline) => (
          <button
            className={styles.button}
            type="button"
            key={discipline}
            aria-pressed={activeFilter === discipline}
            onClick={() => setActiveFilter(discipline)}
          >
            {discipline}
          </button>
        ))}
      </fieldset>
      <div className={styles.list} id="work-list-heading">
        {visibleProjects.map((project) => (
          <article className={styles.item} key={project.slug}>
            <p className={styles.meta}>{project.status}</p>
            <h2>
              <a className={styles.titleLink} href={`/work/${project.slug}/`}>
                {project.title}
              </a>
            </h2>
            <p>{project.thesis}</p>
            <p className={styles.meta}>{project.disciplines.join(" · ")}</p>
            <p>{project.complexity}</p>
            <a className={styles.link} href={`/work/${project.slug}/`} aria-label={`View ${project.title} case study`}>
              View case study -&gt;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
