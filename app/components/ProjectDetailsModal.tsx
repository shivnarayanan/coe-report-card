import React from "react";
import {
  Modal,
  Box,
  Text,
  Tabs,
  rem,
  Badge,
  Group,
  Pill,
  ActionIcon,
  Tooltip,
  Timeline,
} from "@mantine/core";
import { Project } from "../report/types";
import { IconEdit, IconCheck, IconClock, IconAlertCircle, IconCircle } from "@tabler/icons-react";
import { getProjectStatusColor } from "../report/types";

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
        <Tabs defaultValue="overview" color="#CA2420">
          <Modal.Header
            style={{
              backgroundColor: "#f8f9fa",
              borderTopLeftRadius: rem(8),
              borderTopRightRadius: rem(8),
              padding: `${rem(16)} ${rem(24)} ${rem(12)} ${rem(24)}`,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Modal.Title
                style={{
                  fontWeight: 700,
                  fontSize: rem(20),
                  display: "flex",
                  alignItems: "center",
                  gap: rem(5),
                }}
              >
                {project.title}
                {onEdit && (
                  <Tooltip label="Edit Project Details" withArrow position="bottom" zIndex={1050}>
                    <ActionIcon
                      variant="subtle"
                      aria-label="Edit Project"
                      color="#adb5bd"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(project);
                      }}
                      size="md"
                    >
                      <IconEdit size={30} stroke={1.5} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Group gap={8} align="center">
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
                      style={{ fontWeight: 400, background: "#e9ecef" }}
                    >
                      {tag}
                    </Pill>
                  ))}
                </Group>
              </Modal.Title>
              <Group>
                <Modal.CloseButton />
              </Group>
            </Box>
            <Text size="md" c="dimmed" mt="xs" mb="sm">
              {project.description}
            </Text>
          </Modal.Header>

          <Box style={{ background: "#f8f9fa" }}>
            <Tabs.List pl={8}>
              <Tabs.Tab value="overview">OVERVIEW</Tabs.Tab>
              <Tabs.Tab value="metrics">METRICS</Tabs.Tab>
              <Tabs.Tab value="timeline">TIMELINE</Tabs.Tab>
            </Tabs.List>
          </Box>

          <Modal.Body
            style={{
              padding: rem(24),
              height: "70vh",
              overflowY: "auto",
            }}
          >
            <Tabs.Panel value="overview">
              <Text fw={700} size="lg" style={{ color: "#CA2420" }} mb="xs">
                WHY WAS THIS BUILT
              </Text>
              {project.whyWeBuiltThis ? (
                <Text mb="xs">{project.whyWeBuiltThis}</Text>
              ) : (
                <Text mb="xs" c="dimmed">
                  No description available.
                </Text>
              )}
              <Text fw={700} size="lg" style={{ color: "#CA2420" }} mb="xs">
                WHAT HAS BEEN BUILT
              </Text>
              {project.whatWeveBuilt ? (
                <Text mb="xs">{project.whatWeveBuilt}</Text>
              ) : (
                <Text mb="xs" c="dimmed">
                  No description available.
                </Text>
              )}
              <Text fw={700} size="lg" style={{ color: "#CA2420" }} mb="xs">
                INDIVIDUALS INVOLVED
              </Text>
              <Box mb="md">
                {project.individualsInvolved &&
                project.individualsInvolved.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {project.individualsInvolved.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <Text c="dimmed">No individuals listed.</Text>
                )}
              </Box>
            </Tabs.Panel>
            <Tabs.Panel value="timeline">
              {project.timeline && project.timeline.length > 0 ? (
                <Timeline 
                  active={project.timeline.findIndex(item => item.status === 'active')} 
                  bulletSize={24} 
                  lineWidth={2}
                >
                  {project.timeline.map((item) => {
                    const getBulletIcon = () => {
                      switch (item.status) {
                        case 'completed':
                          return <IconCheck size={12} />;
                        case 'active':
                          return <IconClock size={12} />;
                        case 'pending':
                          return <IconAlertCircle size={12} />;
                        case 'future':
                          return <IconCircle size={12} />;
                        default:
                          return <IconCircle size={12} />;
                      }
                    };

                    return (
                      <Timeline.Item 
                        key={item.id}
                        bullet={getBulletIcon()} 
                        title={item.title}
                        color={item.color}
                      >
                        <Text size="sm" c="dimmed" mt={4}>
                          {item.description}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          {item.date}
                        </Text>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  No timeline data available for this project.
                </Text>
              )}
            </Tabs.Panel>
          </Modal.Body>
        </Tabs>
      </Modal.Content>
    </Modal.Root>
  );
}
