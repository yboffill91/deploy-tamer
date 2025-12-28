export interface KeywordLeaf {
  keyword: string;
  volume: number;
  kd: number;
}

export interface TopicNode {
  id: string;
  path: string;
  volume: number;
  kd: number;
  searchIntent: 'TRANSACTIONAL' | 'INFORMATIONAL';
  keywords: KeywordLeaf[];
  children?: TopicNode[];
}

export interface SeoSiloData {
  url: string;
  globalVolume: number;
  globalKd: number;
  topics: TopicNode[];
}
