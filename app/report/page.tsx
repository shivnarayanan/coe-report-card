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
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
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
    values: Pick<
      Project,
      "title" | "description" | "status" | "dueDate" | "department"
    >
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

  return (
    <Container size="xl">
      <Group justify="flex-end" mb="md">
        <Button
          size="compact-md"
          variant="transparent"
          color="#343a40"
          leftSection={<IconPlus size={16} />}
          onClick={() => openProjectModal()}
        >
          New Project
        </Button>
      </Group>

      {loading ? (
        <Grid>
          {[...Array(3)].map((_, idx) => (
            <Grid.Col key={idx} span={4}>
              <Skeleton height={200} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <Center style={{ height: 300, flexDirection: "column" }}>
          <Text size="lg" mb="md">
            No projects found.
          </Text>
        </Center>
      ) : (
        <Grid>
          {projects.map((project) => (
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
