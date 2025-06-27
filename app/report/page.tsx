"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Group,
  Text,
  Skeleton,
  Center,
  TextInput,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { Project } from "./types";
import { mockProjects } from "../data/mockProjects";
import { ProjectCard } from "./components/ProjectCard/ProjectCard";
import { ProjectFormModal } from "./components/ProjectFormModal";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { ProjectDetailsModal } from "./components/ProjectDetailsModal";

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
    values: Pick<Project, "title" | "description" | "status" | "tags">
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

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xs">
        <TextInput
          placeholder="Search by Title or Tag"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ maxWidth: 320 }}
        />
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
