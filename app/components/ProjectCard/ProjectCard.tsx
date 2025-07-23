import React from "react";
import { Card, Badge, Group, Text, Pill } from "@mantine/core";
import { Project } from "../../types/types";
import { getProjectStatusColor } from "../../types/types";
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
      <Group justify="space-between" align="flex-start">
        <Text fw={600} size="lg" style={{ flex: 1, minWidth: 0 }}>
          {project.title}
        </Text>
        <Badge 
          color={getProjectStatusColor(project.status)} 
          variant="light" 
          size="lg"
          style={{ flexShrink: 0 }}
        >
          {project.status}
        </Badge>
      </Group>
      
      <Text size="sm" color="dimmed" mt="sm" lineClamp={4}>
        {project.description}
      </Text>
      
      <Group mt="md" gap={8}>
        {project.tags.slice(0, 2).map((tag: string) => (
          <Pill key={tag} className={styles.departmentPill} c="dimmed" size="lg">
            {tag}
          </Pill>
        ))}
        {project.tags.length > 2 && (
          <Text c="dimmed" size="sm">
            + {project.tags.length - 2} more
          </Text>
        )}
      </Group>
    </Card>
  );
}