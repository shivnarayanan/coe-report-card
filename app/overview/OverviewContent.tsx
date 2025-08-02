"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Group,
  Text,
  Skeleton,
  Center,
  ActionIcon,
  Tooltip,
  Select,
  Modal,
  useModalsStack,
  Pagination,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useSearchParams, useRouter } from "next/navigation";
import { Project, TimelineItem } from "../types/types";
import { ProjectCard } from "@components/ProjectCard/ProjectCard";
import { ProjectFormModal } from "@components/ProjectFormModal/ProjectFormModal";
import { ProjectDetailsModal } from "@components/ProjectDetailsModal/ProjectDetailsModal";
import { PageBackground } from "@components/PageBackground/PageBackground";
import { createProject, updateProject, fetchProjects, ProjectPayload } from "../utils/api";

type ModalId = "details" | "form";

export default function OverviewContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [businessFunctionFilter, setBusinessFunctionFilter] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedFilter, setFocusedFilter] = useState<string | null>(null);
  const [initialFormPage, setInitialFormPage] = useState(1);
  const itemsPerPage = 6;

  const searchParams = useSearchParams();
  const router = useRouter();

  const modalIds: ModalId[] = ["details", "form"];
  const stack = useModalsStack<ModalId>(modalIds);

  const detailModal = stack.register("details");
  const formModal = stack.register("form");

  // Fetch projects from API
  useEffect(() => {
    fetchProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        showNotification({
          title: "Error Loading Projects",
          message: "Unable to retrieve projects from the database. Please check your connection and try again.",
          color: "red",
        });
        setLoading(false);
      });
  }, []);

  // Handle URL parameter changes to open modal
  useEffect(() => {
    if (projects.length === 0) return; // Wait for projects to load

    const projectId = searchParams.get('id');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project && (!currentProject || currentProject.id !== projectId)) {
        setCurrentProject(project);
        if (!detailModal.opened) {
          // Add a small delay to ensure proper animation
          setTimeout(() => {
            stack.open("details");
          }, 50);
        }
      } else if (!project) {
        // Project not found, remove from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete('id');
        router.replace(`/overview?${params.toString()}`);
      }
    } else {
      // No id in URL, close modal if open
      if (detailModal.opened) {
        stack.close("details");
      }
      if (currentProject) {
        setCurrentProject(null);
      }
    }
  }, [searchParams, projects]);

  // Helper function to update URL
  const updateURL = useCallback((projectId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (projectId) {
      params.set('id', projectId);
    } else {
      params.delete('id');
    }
    router.replace(`/overview?${params.toString()}`);
  }, [searchParams, router]);

  const statusOptions = [
    { value: "PRODUCTION", label: "PRODUCTION" },
    { value: "PILOT", label: "PILOT" },
    { value: "POC", label: "POC" },
    { value: "IDEATION", label: "IDEATION" },
  ];

  const businessFunctionOptions = [
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "HR" },
    { value: "IT", label: "IT" },
    { value: "Operations", label: "Operations" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "Other", label: "Other" },
  ];

  const getDynamicWidth = (value: string | null, defaultWidth: number, filterKey: string) => {
    if (!value || focusedFilter === filterKey) return `${defaultWidth}px`;

    const estimatedWidth = Math.max(75, value.length * 9 + 50);
    return `${estimatedWidth}px`;
  };

  // Map tabs to form pages
  const getFormPageFromTab = (activeTab: string): number => {
    switch (activeTab) {
      case "overview":
        return 1;
      case "benefits":
        return 2;
      case "timeline":
        return 3;
      default:
        return 1;
    }
  };

  const transformToApiPayload = (values: Partial<Project>): ProjectPayload => {
    return {
      id: values.id || Date.now().toString(),
      title: values.title || "",
      description: values.description || "",
      status: values.status || "IDEATION",
      tags: (values.tags || []).map(tag => ({ tag })),
      why_we_built_this: values.whyWeBuiltThis || "",
      what_weve_built: values.whatWeveBuilt || "",
      individuals: (values.individualsInvolved || []).map(name => ({ name })),
      timeline: (values.timeline || []).map((item: TimelineItem) => ({
        title: item.title,
        description: item.description,
        date: item.date,
        is_step_active: item.isStepActive,
      })),
      nti_status: values.ntiStatus || "",
      nti_link: values.ntiLink || "",
      primary_benefits_category: values.primaryBenefitsCategory || "",
      primary_ai_benefit_category: values.primaryAIBenefitCategory || "",
      investment_required: values.investmentRequired || "",
      expected_near_term_benefits: values.expectedNearTermBenefits || "",
      expected_long_term_benefits: values.expectedLongTermBenefits || "",
      primary_business_function: values.primaryBusinessFunction || "",
    };
  };

  const handleSubmit = async (values: Partial<Project>) => {
    try {
      const payload = transformToApiPayload(values);
      
      if (currentProject) {
        // Update existing project
        await updateProject(currentProject.id, payload);
        
        // Update local state
        const updatedProject = { ...currentProject, ...values } as Project;
        setProjects((prev) =>
          prev.map((p) => (p.id === currentProject.id ? updatedProject : p))
        );
        
        // Update current project with new data
        setCurrentProject(updatedProject);
        
        showNotification({ 
          title: "Project Updated Succesfully",
          message: `"${values.title || currentProject.title}" has been successfully updated with your changes.`, 
          color: "green" 
        });
        
        stack.close("form");
        
        // Re-open details with updated data via URL
        setTimeout(() => {
          updateURL(currentProject.id);
        }, 0);
      } else {
        // Create new project
        const newProject = await createProject(payload);
        
        // Add to local state
        setProjects((prev) => [
          ...prev,
          { ...values, id: newProject.id } as Project,
        ]);
        
        showNotification({
          title: "Project Created Succesfully",
          message: `New project "${values.title}" has been successfully added to your portfolio.`,
          color: "green",
        });
        
        stack.close("form");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      showNotification({
        title: "Project Save Failed",
        message: `Unable to ${currentProject ? 'update' : 'create'} the project "${values.title || currentProject?.title || 'Untitled'}". Please try again.`,
        color: "red",
      });
    }
  };

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
  const filtered = projects.filter((p) => {
    const matchesTag = tagFilter ? p.tags.includes(tagFilter) : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesBusinessFunction = businessFunctionFilter
      ? p.primaryBusinessFunction === businessFunctionFilter
      : true;
    return matchesTag && matchesStatus && matchesBusinessFunction;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tagFilter, statusFilter, businessFunctionFilter]);

  return (
    <PageBackground>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Select
            placeholder="Business Function Filter"
            data={businessFunctionOptions}
            value={businessFunctionFilter}
            onChange={setBusinessFunctionFilter}
            clearable
            style={{ width: getDynamicWidth(businessFunctionFilter, 240, 'businessFunction') }}
            onClick={() => setFocusedFilter('businessFunction')}
            onBlur={() => setFocusedFilter(null)}
          />
          <Select
            placeholder="Tag Filter"
            data={allTags}
            value={tagFilter}
            onChange={setTagFilter}
            clearable
            style={{ width: getDynamicWidth(tagFilter, 200, 'tag') }}
            onClick={() => setFocusedFilter('tag')}
            onBlur={() => setFocusedFilter(null)}
          />
          <Select
            placeholder="Status Filter"
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ width: getDynamicWidth(statusFilter, 200, 'status') }}
            onClick={() => setFocusedFilter('status')}
            onBlur={() => setFocusedFilter(null)}
          />
        </Group>
        <Tooltip label="New Project" withArrow position="left">
          <ActionIcon
            variant="transparent"
            color="gray.8"
            size="lg"
            onClick={() => {
              setCurrentProject(null);
              setInitialFormPage(1); // New project always starts at page 1
              stack.open("form");
            }}
          >
            <IconPlus size={25} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {loading ? (
        <Grid>
          {[...Array(6)].map((_, i) => (
            <Grid.Col key={i} span={4}>
              <Skeleton height={220} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Center style={{ height: 300, flexDirection: "column" }}>
          <Text size="lg" mb="md">
            No projects found.
          </Text>
        </Center>
      ) : (
        <>
          <Grid>
            {paginatedProjects.map((proj) => (
              <Grid.Col key={proj.id} span={4}>
                <ProjectCard
                  project={proj}
                  onEdit={(p) => {
                    setCurrentProject(p);
                    setInitialFormPage(1); // ProjectCard edit always starts at page 1
                    stack.open("form");
                  }}
                  onView={(p) => {
                    updateURL(p.id);
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Group justify="flex-end" mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                size="md"
              />
            </Group>
          )}
        </>
      )}

      <Modal.Stack>
        <ProjectDetailsModal
          opened={detailModal.opened}
          onClose={() => updateURL(null)}
          project={currentProject}
          onEdit={(p, activeTab = "overview") => {
            setCurrentProject(p);
            setInitialFormPage(getFormPageFromTab(activeTab));
            stack.open("form");
          }}
        />

        <ProjectFormModal
          {...formModal}
          project={currentProject}
          onSubmit={handleSubmit as any}
          initialPage={initialFormPage}
        />
      </Modal.Stack>
    </PageBackground>
  );
}