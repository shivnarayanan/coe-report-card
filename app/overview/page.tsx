"use client";

import React, { useState, useEffect } from "react";
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
import { Project, TimelineItem } from "../types/types";
import { ProjectCard } from "@components/ProjectCard/ProjectCard";
import { ProjectFormModal } from "@components/ProjectFormModal/ProjectFormModal";
import { ProjectDetailsModal } from "@components/ProjectDetailsModal/ProjectDetailsModal";
import { PageBackground } from "@components/PageBackground/PageBackground";
import { createProject, updateProject, fetchProjects, ProjectPayload } from "../utils/api";

type ModalId = "details" | "form";

export default function ReportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [businessFunctionFilter, setBusinessFunctionFilter] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const getDynamicWidth = (value: string | null, defaultWidth: number) => {
    if (!value) return `${defaultWidth}px`;

    const estimatedWidth = Math.max(75, value.length * 9 + 40);
    return `${estimatedWidth}px`;
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
        setProjects((prev) =>
          prev.map((p) => (p.id === currentProject.id ? { ...p, ...values } : p))
        );
        
        showNotification({ 
          title: "Project Updated Succesfully",
          message: `"${values.title || currentProject.title}" has been successfully updated with your changes.`, 
          color: "green" 
        });
        
        stack.close("form");
        
        // Re-open details with updated data
        setTimeout(() => {
          setCurrentProject({ ...currentProject, ...values });
          stack.open("details");
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
            placeholder="Filter by Business Function"
            data={businessFunctionOptions}
            value={businessFunctionFilter}
            onChange={setBusinessFunctionFilter}
            clearable
            style={{ width: getDynamicWidth(businessFunctionFilter, 240) }}
          />
          <Select
            placeholder="Filter by Tag"
            data={allTags}
            value={tagFilter}
            onChange={setTagFilter}
            clearable
            style={{ width: getDynamicWidth(tagFilter, 200) }}
          />
          <Select
            placeholder="Filter by Status"
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ width: getDynamicWidth(statusFilter, 200) }}
          />
        </Group>
        <Tooltip label="New Project" withArrow position="left">
          <ActionIcon
            variant="transparent"
            color="gray.8"
            size="lg"
            onClick={() => {
              setCurrentProject(null);
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
                    stack.open("form");
                  }}
                  onView={(p) => {
                    setCurrentProject(p);
                    stack.open("details");
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
          {...detailModal}
          project={currentProject}
          onEdit={(p) => {
            setCurrentProject(p);
            stack.open("form");
          }}
        />

        <ProjectFormModal
          {...formModal}
          project={currentProject}
          onSubmit={handleSubmit as any}
        />
      </Modal.Stack>
    </PageBackground>
  );
}
