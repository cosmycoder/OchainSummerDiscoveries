export interface RegistryData {
  name: string;
  url: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface GraphNode {
  id: string;
  group: string;
  description: string;
  imageUrl: string;
  url: string;
  depth: number;
}

export interface GraphArrow {
  source: string;
  target: string;
  name: string;
  description: string;
  group: string;
}

export interface GraphData {
  nodes: GraphNode[],
  links: GraphArrow[]
}

export interface ImageCacheData { imageUrl: string; base64data: string }
export interface SvgCacheData { imageUrl: string; svgData: string }