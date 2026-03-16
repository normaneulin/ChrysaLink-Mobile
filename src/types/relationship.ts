export interface GraphNode {
  id: string;
  label: string;
  type: 'lepidoptera' | 'plant' | 'family' | 'placeholder';
  imageUrl?: string;
  scientificName?: string;
  size?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  strength?: number;
  color?: string;
}

export interface RelationshipData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NetworkRelationship {
  id: string;
  lepidoptera_id: string;
  plant_id: string;
  interaction_type: 'host' | 'nectar' | 'unknown';
  evidence_level: 'observed' | 'literature' | 'inferred';
  references?: string;
  created_at: string;
}