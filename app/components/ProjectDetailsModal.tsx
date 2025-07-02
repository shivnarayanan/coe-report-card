import React from "react";
import { Modal, Box, Text, Tabs, rem, Badge, Group, Pill } from "@mantine/core";
import { Project } from "../report/types";

interface ProjectDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ProjectDetailsModal({
  opened,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  const colorMap: Record<Project["status"], string> = {
    PILOT: "yellow",
    ACTIVE: "green",
    RETIRED: "gray",
    MAINTENANCE: "blue",
  };

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
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
                  gap: rem(12),
                }}
              >
                {project.title}
                <Group gap={8} align="center">
                  <Badge
                    color={colorMap[project.status]}
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
              <Modal.CloseButton />
            </Box>
            <Text size="md" c="dimmed" mt="xs" mb="sm">
              {project.description}
            </Text>
          </Modal.Header>

          <Box style={{ background: "#f8f9fa" }}>
            <Tabs.List pl={8}>
              <Tabs.Tab value="overview">OVERVIEW</Tabs.Tab>
              <Tabs.Tab value="metrics">METRICS</Tabs.Tab>
              <Tabs.Tab value="updates">UPDATES</Tabs.Tab>
            </Tabs.List>
          </Box>

          <Modal.Body
            style={{
              padding: rem(24),
              height: "60vh",
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
            <Tabs.Panel value="updates">
              <Text></Text>
            </Tabs.Panel>
          </Modal.Body>
        </Tabs>
      </Modal.Content>
    </Modal.Root>
  );
}
