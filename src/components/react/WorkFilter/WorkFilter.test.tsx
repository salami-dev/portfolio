import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WorkFilter } from "./WorkFilter";
import type { WorkFilterProject } from "./types";

const projects: WorkFilterProject[] = [
  {
    title: "Interface project",
    slug: "interface-project",
    context: "Interface product context",
    contribution: "Built the interface",
    impact: "Opened a browser channel",
    disciplines: ["Interface Engineering"],
    complexity: "Complexity frame"
  },
  {
    title: "Data project",
    slug: "data-project",
    context: "Data product context",
    contribution: "Built the data system",
    impact: "Made processing reliable",
    disciplines: ["Data Engineering"],
    complexity: "Complexity frame"
  }
];

describe("WorkFilter", () => {
  it("filters projects by discipline", async () => {
    render(<WorkFilter projects={projects} />);

    await userEvent.click(screen.getByRole("button", { name: "Data Engineering" }));

    expect(screen.getByText("Data project")).toBeInTheDocument();
    expect(screen.queryByText("Interface project")).not.toBeInTheDocument();
  });
});
