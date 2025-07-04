// ProjectCard.tsx
import React from "react";
import { Card, Badge, Group, Text, Pill } from "@mantine/core";
import { Project } from "../../report/types";
import { getProjectStatusColor } from "../../report/types";
import styles from "./ProjectCard.module.css";

export type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onView: (project: Project) => void;
};

export function ProjectCard({
  project,
  onEdit,
  onView,
}: ProjectCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={styles.card}
      onClick={() => onView(project)}
    >
      <Group justify="space-between" align="center">
        <Group align="center">
          <Text fw={600} size="lg">
            {project.title}
          </Text>
          <Badge color={getProjectStatusColor(project.status)} variant="light" size="lg">
            {project.status}
          </Badge>
        </Group>
      </Group>

      <Text size="sm" color="dimmed" mt="sm" lineClamp={4}>
        {project.description}
      </Text>
      <Group mt="md" gap={8}>
        {project.tags.map((tag: string) => (
          <Pill key={tag} className={styles.departmentPill} c="dimmed" size="lg">
            {tag}
          </Pill>
        ))}
      </Group>
    </Card>
  );
}
