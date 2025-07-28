const API_BASE_URL = "http://localhost:8005";

export interface ProjectPayload {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: Array<{ tag: string }>;
  why_we_built_this?: string;
  what_weve_built?: string;
  individuals: Array<{ name: string }>;
  timeline: Array<{
    title: string;
    description: string;
    date: string;
    is_step_active: boolean;
  }>;
  nti_status?: string;
  nti_link?: string;
  primary_benefits_category?: string;
  primary_ai_benefit_category?: string;
  investment_required?: string;
  expected_near_term_benefits?: string;
  expected_long_term_benefits?: string;
  primary_business_function?: string;
}

export async function createProject(projectData: ProjectPayload) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.statusText}`);
  }

  return response.json();
}

export async function updateProject(projectId: string, projectData: ProjectPayload) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
}

export interface AnalyticsOverview {
  totalProjects: number;
  activeMilestones: number;
  projectsByStatus: Array<{ status: string; count: number }>;
  projectsByFunction: Array<{ function: string; count: number }>;
  projectsByBenefits: Array<{ category: string; count: number }>;
  projectsByAIBenefits: Array<{ category: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
}

export interface TimelineAnalytics {
  projectProgress: Array<{
    projectId: string;
    projectTitle: string;
    status: string;
    totalMilestones: number;
    activeMilestones: number;
    completedMilestones: number;
    progressPercentage: number;
  }>;
  totalTimelineItems: number;
}

export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  const response = await fetch(`${API_BASE_URL}/analytics/overview`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics overview: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchTimelineAnalytics(): Promise<TimelineAnalytics> {
  const response = await fetch(`${API_BASE_URL}/analytics/timeline`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch timeline analytics: ${response.statusText}`);
  }

  return response.json();
}