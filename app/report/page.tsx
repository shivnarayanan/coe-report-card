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
  Modal,
  useModalsStack,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { Project } from "@types/types";
import { mockProjects } from "../data/mockProjects";
import { ProjectCard } from "@components/ProjectCard/ProjectCard";
import { ProjectFormModal } from "@components/ProjectFormModal";
import { ProjectDetailsModal } from "@components/ProjectDetailsModal/ProjectDetailsModal";

type ModalId = "details" | "form";

export default function ReportPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // define your two modal slots
  const modalIds: ModalId[] = ["details", "form"];
  const stack = useModalsStack<ModalId>(modalIds);

  // register each slot to get opened/onClose/zIndex etc.
  const detailModal = stack.register("details");
  const formModal = stack.register("form");

  // simulate loading
  useEffect(() => {
    const t = setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1_000);
    return () => clearTimeout(t);
  }, []);

  const statusOptions = [
    { value: "PILOT", label: "PILOT" },
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "RETIRED", label: "RETIRED" },
    { value: "MAINTENANCE", label: "MAINTENANCE" },
  ];

  // handle create / update
  const handleSubmit = (
    values: Pick<
      Project,
      | "title"
      | "description"
      | "status"
      | "tags"
      | "whyWeBuiltThis"
      | "whatWeveBuilt"
      | "individualsInvolved"
    >
  ) => {
    if (currentProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProject.id ? { ...p, ...values } : p
        )
      );
      showNotification({ message: "Project updated", color: "blue" });
      stack.close("form");
      // after close, re-open details with updated data
      setTimeout(() => {
        setCurrentProject({ ...currentProject, ...values });
        stack.open("details");
      }, 0);
    } else {
      setProjects((prev) => [
        ...prev,
        { id: Date.now().toString(), ...values },
      ]);
      showNotification({
        message: "Project added successfully!",
        color: "green",
      });
      stack.close("form");
    }
  };

  // filtering logic
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
  const filtered = projects.filter((p) => {
    const matchesTag = tagFilter ? p.tags.includes(tagFilter) : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesTag && matchesStatus;
  });

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xs">
        <Group>
          <Select
            placeholder="Filter by Tag"
            data={allTags}
            value={tagFilter}
            onChange={setTagFilter}
            clearable
            w={200}
          />
          <Select
            placeholder="Filter by Status"
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={200}
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
          {[...Array(3)].map((_, i) => (
            <Grid.Col key={i} span={4}>
              <Skeleton height={200} radius="md" />
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
        <Grid>
          {filtered.map((proj) => (
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
          onSubmit={handleSubmit}
        />
      </Modal.Stack>
    </Container>
  );
}