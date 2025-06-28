import React from "react";
import { Modal, Box, Text, Tabs, rem, Badge } from "@mantine/core";
import { Project } from "../types";

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

  const colorMap: Record<Project['status'], string> = {
    PILOT: 'yellow',
    ACTIVE: 'green',
    RETIRED: 'gray',
    MAINTENANCE: 'blue',
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl" radius="lg" centered>
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
              <Modal.Title style={{ fontWeight: 700, fontSize: rem(20), display: 'flex', alignItems: 'center', gap: rem(12) }}>
                {project.title}
                <Badge color={colorMap[project.status]} variant="light" size="lg">
                  {project.status}
                </Badge>
              </Modal.Title>
              <Modal.CloseButton />
            </Box>
            <Text size="md" c="dimmed" mt="xs" mb="sm">
              {project.description}
            </Text>
          </Modal.Header>

          <Box style={{ background: "#f8f9fa" }} >
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
              <Text fw={700} size="lg" style={{ color: '#CA2420' }} mb="xs">
                WHY WAS THIS BUILT
              </Text>
              {project.whyWeBuiltThis && (
                <Text mb="xs" c="dimmed">{project.whyWeBuiltThis}</Text>
              )}
              <Text mb="md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
              <Text fw={700} size="lg" style={{ color: '#CA2420' }} mb="xs">
                WHAT HAS BEEN BUILT
              </Text>
              {project.whatWeveBuilt && (
                <Text mb="xs" c="dimmed">{project.whatWeveBuilt}</Text>
              )}
              <Text mb="md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
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
