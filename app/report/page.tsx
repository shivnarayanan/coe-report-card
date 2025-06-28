"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Group,
  Text,
  Skeleton,
  Center,
  ActionIcon,
  Tooltip,
  Select,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { Project } from "./types";
import { mockProjects } from "../data/mockProjects";
import { ProjectCard } from "@components/ProjectCard/ProjectCard";
import { ProjectFormModal } from "@components/ProjectFormModal";
import { DeleteConfirmationModal } from "@components/DeleteConfirmationModal";
import { ProjectDetailsModal } from "@components/ProjectDetailsModal";

export default function ReportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statusOptions = [
    { value: 'PILOT', label: 'PILOT' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'RETIRED', label: 'RETIRED' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE' },
  ];

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const openProjectModal = (project?: Project) => {
    setCurrentProject(project || null);
    setModalOpen(true);
  };

  const handleSubmit = (
    values: Pick<Project, "title" | "description" | "status" | "tags" | "whyWeBuiltThis" | "whatWeveBuilt">
  ) => {
    if (currentProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? { ...p, ...values } : p))
      );
      showNotification({ message: "Project updated", color: "blue" });
    } else {
      setProjects((prev) => [
        ...prev,
        { id: Date.now().toString(), ...values },
      ]);
      showNotification({
        message: "Project added successfully!",
        color: "green",
      });
    }
  };

  const openDeleteModal = (project: Project) => {
    setToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (toDelete) {
      setProjects((prev) => prev.filter((p) => p.id !== toDelete.id));
      showNotification({ message: "Project deleted", color: "red" });
    }
  };

  const openDetailsModal = (project: Project) => {
    setDetailsProject(project);
    setDetailsModalOpen(true);
  };

  // Get all unique tags from projects
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesTag = tagFilter ? project.tags.includes(tagFilter) : true;
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    return matchesSearch && matchesTag && matchesStatus;
  });

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xs">
        <Group gap={1}>
          <Select
            placeholder="Filter by Tag"
            data={allTags}
            value={tagFilter}
            onChange={setTagFilter}
            clearable
            style={{ minWidth: 180, marginRight: 12 }}
          />
          <Select
            placeholder="Filter by Status"
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ minWidth: 180 }}
          />
        </Group>
        <Tooltip label="New Project" withArrow position="left">
          <ActionIcon
            variant="transparent"
            color="#343a40"
            size="compact-lg"
            onClick={() => openProjectModal()}
            aria-label="New Project"
          >
            <IconPlus size={25} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {loading ? (
        <Grid>
          {[...Array(3)].map((_, idx) => (
            <Grid.Col key={idx} span={4}>
              <Skeleton height={200} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      ) : filteredProjects.length === 0 ? (
        <Center style={{ height: 300, flexDirection: "column" }}>
          <Text size="lg" mb="md">
            No projects found.
          </Text>
        </Center>
      ) : (
        <Grid>
          {filteredProjects.map((project) => (
            <Grid.Col key={project.id} span={4}>
              <ProjectCard
                project={project}
                onEdit={openProjectModal}
                onDelete={openDeleteModal}
                onView={openDetailsModal}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <ProjectFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        project={currentProject}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        project={toDelete}
        onConfirm={handleDelete}
      />

      <ProjectDetailsModal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        project={detailsProject}
      />
    </Container>
  );
}
