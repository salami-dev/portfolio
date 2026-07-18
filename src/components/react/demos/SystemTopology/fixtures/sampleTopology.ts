import type { SystemTopologyFixture } from "../types/topology";

export const sampleTopology: SystemTopologyFixture = {
  nodes: [
    { id: "interface", label: "Interface", kind: "interface", description: "Product surface boundary." },
    { id: "service", label: "Services", kind: "service", description: "Service boundary." },
    { id: "data", label: "Data", kind: "data", description: "Persistence boundary." },
    { id: "infra", label: "Infrastructure", kind: "infrastructure", description: "Runtime boundary." },
    { id: "observe", label: "Observability", kind: "observability", description: "Signal boundary." }
  ],
  edges: [
    { from: "interface", to: "service", label: "requests" },
    { from: "service", to: "data", label: "reads/writes" },
    { from: "service", to: "infra", label: "runs on" },
    { from: "infra", to: "observe", label: "emits signals" }
  ]
};
