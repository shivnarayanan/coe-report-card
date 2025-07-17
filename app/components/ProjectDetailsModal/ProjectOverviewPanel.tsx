import React from "react";
import { Box, Text, Table } from "@mantine/core";
import { Project } from "../../types/types";

interface ProjectOverviewPanelProps {
  project: Project;
}

const ProjectOverviewPanel: React.FC<ProjectOverviewPanelProps> = ({ project }) => (
  <>
    <Text fw={700} size="lg" style={{ color: "#C42138" }} mb="xs">
      WHY WAS THIS BUILT
    </Text>
    {project.whyWeBuiltThis ? (
      <Text mb="sm">{project.whyWeBuiltThis}</Text>
    ) : (
      <Text mb="sm" c="dimmed">
        No description available.
      </Text>
    )}

    <Text fw={700} size="lg" style={{ color: "#C42138" }} mb="xs">
      WHAT HAS BEEN BUILT
    </Text>
    {project.whatWeveBuilt ? (
      <Text mb="sm">{project.whatWeveBuilt}</Text>
    ) : (
      <Text mb="sm" c="dimmed">
        No description available.
      </Text>
    )}

    <Text fw={700} size="lg" style={{ color: "#C42138" }} mb="xs" mt="lg">
      ADDITIONAL INFORMATION
    </Text>
    <Table variant="vertical" layout="fixed" withTableBorder mt="md">
      <Table.Tbody>
        <Table.Tr>
          <Table.Th w={220}>NTI Status</Table.Th>
          <Table.Td>
            {project.ntiStatus || <Text c="dimmed">No NTI status available.</Text>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={220}>NTI Link</Table.Th>
          <Table.Td>
            {project.ntiLink ? (
              <Text component="a" size="sm" href={project.ntiLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                {project.ntiLink}
              </Text>
            ) : (
              <Text c="dimmed">No NTI link provided.</Text>
            )}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Primary Benefits Category</Table.Th>
          <Table.Td>
            {project.primaryBenefitsCategory || <Text c="dimmed">No primary benefits category provided.</Text>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Primary AI Benefit Category</Table.Th>
          <Table.Td>
            {project.primaryAIBenefitCategory || <Text c="dimmed">No primary AI benefit category provided.</Text>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Individuals Involved</Table.Th>
          <Table.Td>
            {project.individualsInvolved?.length ? (
              project.individualsInvolved.join(", ")
            ) : (
              <Text c="dimmed">No individuals listed.</Text>
            )}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </>
);

export default ProjectOverviewPanel; 