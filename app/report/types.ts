export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isStepActive: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'PILOT' | 'ACTIVE' | 'RETIRED' | 'MAINTENANCE';
  tags: string[];
  whyWeBuiltThis?: string;
  whatWeveBuilt?: string;
  individualsInvolved?: string[];
  timeline?: TimelineItem[];
}

// Shared status color map and utility
export const PROJECT_STATUS_COLOR_MAP: Record<Project["status"], string> = {
  PILOT: "yellow",
  ACTIVE: "green",
  RETIRED: "gray",
  MAINTENANCE: "blue",
};

export function getProjectStatusColor(status: Project["status"]): string {
  return PROJECT_STATUS_COLOR_MAP[status] || "gray";
} 