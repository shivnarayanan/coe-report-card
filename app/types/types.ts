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
  status: 'PRODUCTION' | 'PILOT' | 'POC' | 'IDEATION';
  tags: string[];
  whyWeBuiltThis?: string;
  whatWeveBuilt?: string;
  individualsInvolved?: string[];
  timeline?: TimelineItem[];
  ntiStatus?: 'Not Applicable' | 'In-Progress' | 'Completed';
  ntiLink?: string;
  primaryBenefitsCategory?: 'Employee Productivity' | 'Cost Avoidance' | 'Revenue Generation';
  primaryAIBenefitCategory?: 'Knowledge Management' | 'Code Development & Support' | 'Content Generation' | 'Data Analysis & Summarisation' | 'Document Processing' | 'Process or Workflow Automation';
  investmentRequired?: string;
  expectedNearTermBenefits?: string;
  expectedLongTermBenefits?: string;
  primaryBusinessFunction: 'Human Resources' | 'Risk Management' | 'Global Markets' | 'Chief Data Office' | 'Operations' | 'Finance';
}

// Shared status color map and utility
export const PROJECT_STATUS_COLOR_MAP: Record<Project["status"], string> = {
  "PRODUCTION": "green",
  "PILOT": "violet", 
  "POC": "blue",
  "IDEATION": "orange",
};

export function getProjectStatusColor(status: Project["status"]): string {
  return PROJECT_STATUS_COLOR_MAP[status] || "gray";
}

// NTI Status color map and utility
export const NTI_STATUS_COLOR_MAP: Record<NonNullable<Project["ntiStatus"]>, string> = {
  "Not Applicable": "light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-2))",
  "In-Progress": "yellow",
  "Completed": "green",
};

export function getNTIStatusColor(status: Project["ntiStatus"]): string {
  return status ? NTI_STATUS_COLOR_MAP[status] || "gray" : "gray";
} 