import React, { useMemo } from "react";
import {
  Modal,
  Box,
  Text,
  Tabs,
  rem,
  Badge,
  Pill,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  FocusTrap,
} from "@mantine/core";
import {
  IconEdit,
  IconCheck,
  IconClock,
  IconCircle,
} from "@tabler/icons-react";
import { Project, getProjectStatusColor } from "../../types/types";
import ProjectOverviewPanel from "./ProjectOverviewPanel";
import ProjectMetricsPanel from "./ProjectMetricsPanel";
import ProjectTimelinePanel from "./ProjectTimelinePanel";

interface ProjectDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  project: Project | null;
  onEdit?: (project: Project) => void;
}

export function ProjectDetailsModal({
  opened,
  onClose,
  project,
  onEdit,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  // Find the active step via isStepActive flag; fallback to last item
  const timeline = project.timeline || [];
  const rawActive = timeline.findIndex((item) => item.isStepActive);
  const activeIndex =
    rawActive >= 0 ? rawActive : timeline.length > 0 ? timeline.length - 1 : 0;

  // Helper to render bullets consistently
  const renderBullet = (index: number) => {
    const isCompleted = index < activeIndex;
    const isActive = index === activeIndex;

    if (isCompleted) {
      return (
        <ThemeIcon color="NomuraRed" variant="filled" size={24} radius="xl">
          <IconCheck size={16} />
        </ThemeIcon>
      );
    }

    if (isActive) {
      return (
        <ThemeIcon color="NomuraRed" variant="filled" size={24} radius="xl">
          <IconClock size={16} />
        </ThemeIcon>
      );
    }

    return (
      <ThemeIcon color="NomuraRed" variant="subtle" size={24} radius="xl">
        <IconCircle size={16} />
      </ThemeIcon>
    );
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
      zIndex={1000}
      centered
    >
      <Modal.Overlay />
      <Modal.Content style={{ overflow: "hidden" }}>
        <FocusTrap.InitialFocus />
        <Tabs defaultValue="overview" color="NomuraRed">
          <Modal.Header
            p={`${rem(16)} ${rem(24)} ${rem(12)} ${rem(24)}`}
            style={{
              backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
              borderTopLeftRadius: rem(8),
              borderTopRightRadius: rem(8),
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              display="flex"
              w="100%"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: rem(16),
              }}
            >
              <Box
                flex={1}
                display="flex"
                style={{
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: rem(8),
                }}
              >
                <Text
                  fw={700}
                  fz={rem(20)}
                  lh={1.2}
                  style={{ flexShrink: 0 }}
                >
                  {project.title}
                </Text>
                {onEdit && (
                  <Tooltip
                    label="Edit Project Details"
                    withArrow
                    position="bottom"
                    zIndex={1050}
                  >
                    <ActionIcon
                      variant="subtle"
                      aria-label="Edit Project"
                      c="dimmed"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                      }}
                      size="md"
                      style={{ flexShrink: 0 }}
                    >
                      <IconEdit size={30} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Badge
                  color={getProjectStatusColor(project.status)}
                  variant="light"
                  size="lg"
                >
                  {project.status}
                </Badge>
                {project.tags.map((tag) => (
                  <Pill
                    key={tag}
                    c="dimmed"
                    size="lg"
                    fw={400}
                    style={{ backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))' }}
                  >
                    {tag}
                  </Pill>
                ))}
              </Box>
              <Modal.CloseButton style={{ flexShrink: 0 }} />
            </Box>
            <Text size="md" c="dimmed" mt="xs" mb="sm">
              {project.description}
            </Text>
          </Modal.Header>

          <Box style={{ backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' }}>
            <Tabs.List pl={8}>
              <Tabs.Tab value="overview">OVERVIEW</Tabs.Tab>
              <Tabs.Tab value="metrics">METRICS</Tabs.Tab>
              <Tabs.Tab value="timeline">TIMELINE</Tabs.Tab>
            </Tabs.List>
          </Box>

          <Modal.Body p={rem(24)} h="60vh" style={{ overflowY: "auto" }}>
            <Tabs.Panel value="overview">
              <ProjectOverviewPanel project={project} />
            </Tabs.Panel>

            <Tabs.Panel value="metrics">
              <ProjectMetricsPanel project={project} />
            </Tabs.Panel>

            <Tabs.Panel value="timeline">
              <ProjectTimelinePanel
                timeline={timeline}
                activeIndex={activeIndex}
                renderBullet={renderBullet}
              />
            </Tabs.Panel>
          </Modal.Body>
        </Tabs>
      </Modal.Content>
    </Modal.Root>
  );
}