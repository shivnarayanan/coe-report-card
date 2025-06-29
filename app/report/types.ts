export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'PILOT' | 'ACTIVE' | 'RETIRED' | 'MAINTENANCE';
  tags: string[];
  whyWeBuiltThis?: string;
  whatWeveBuilt?: string;
  individualsInvolved?: string[];
} 