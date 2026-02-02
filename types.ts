
export interface CustomerHistory {
  phone: string;
  successCount: number;
  returnCount: number;
  successRate: number;
  lastOrderDate: string;
}

export interface ExperienceEntry {
  id: string;
  merchantName: string;
  customerPhone: string;
  rating: 'positive' | 'negative' | 'neutral';
  comment: string;
  timestamp: string;
}

export type ViewType = 'fraud-check' | 'my-entries' | 'recent-activity';
