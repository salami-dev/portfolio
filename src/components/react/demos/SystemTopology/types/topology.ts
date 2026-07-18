export type TopologyNodeKind = "interface" | "service" | "data" | "infrastructure" | "observability";

export type TopologyNode = {
  id: string;
  label: string;
  kind: TopologyNodeKind;
  description: string;
};

export type TopologyEdge = {
  from: string;
  to: string;
  label: string;
};

export type SystemTopologyFixture = {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
};
