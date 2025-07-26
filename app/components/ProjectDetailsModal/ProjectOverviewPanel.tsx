import React from "react";
import { Box, Text, Table, Badge } from "@mantine/core";
import { Project, getNTIStatusColor } from "../../types/types";

interface ProjectOverviewPanelProps {
  project: Project;
}

const ProjectOverviewPanel: React.FC<ProjectOverviewPanelProps> = ({
  project,
}) => (
  <>
    <Text fw={700} size="md" c="NomuraRed" mb="xs">
      WHY WAS THIS BUILT
    </Text>
    {project.whyWeBuiltThis ? (
      <Text mb="sm">{project.whyWeBuiltThis}</Text>
    ) : (
      <Text mb="sm" c="dimmed">
        No description available.
      </Text>
    )}

    <Text fw={700} size="md" c="NomuraRed" mb="xs">
      WHAT HAS BEEN BUILT
    </Text>
    {project.whatWeveBuilt ? (
      <Text mb="sm">{project.whatWeveBuilt}</Text>
    ) : (
      <Text mb="sm" c="dimmed">
        No description available.
      </Text>
    )}

    <Text fw={700} size="md" c="NomuraRed" mb="xs" mt="lg">
      ADDITIONAL INFORMATION
    </Text>
    <Table variant="vertical" layout="fixed" withTableBorder mt="md">
      <Table.Tbody>
        <Table.Tr>
          <Table.Th w={220}>NTI Status</Table.Th>
          <Table.Td>
            {project.ntiStatus ? (
              <Badge
                color={getNTIStatusColor(project.ntiStatus)}
                variant="dot"
                size="lg"
              >
                {project.ntiStatus}
              </Badge>
            ) : (
              <Text c="dimmed" size="sm">No NTI status available.</Text>
            )}
          </Table.Td>
        </Table.Tr>
        {project.ntiStatus !== 'Not Applicable' && (
          <Table.Tr>
            <Table.Th w={220}>NTI Link</Table.Th>
            <Table.Td>
              {project.ntiLink ? (
                <Text
                  component="a"
                  size="sm"
                  href={project.ntiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: "break-all" }}
                >
                  {project.ntiLink}
                </Text>
              ) : (
                <Text c="dimmed" size="sm">
                  No NTI link available.
                </Text>
              )}
            </Table.Td>
          </Table.Tr>
        )}
        <Table.Tr>
          <Table.Th w={230}>Primary Business Function</Table.Th>
          <Table.Td>
            {project.primaryBusinessFunction || (
              <Text c="dimmed" size="sm">
                No primary business function provided.
              </Text>
            )}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Primary Benefits Category</Table.Th>
          <Table.Td>
            {project.primaryBenefitsCategory || (
              <Text c="dimmed" size="sm">
                No primary benefits category provided.
              </Text>
            )}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Primary AI Benefit Category</Table.Th>
          <Table.Td>
            {project.primaryAIBenefitCategory || (
              <Text c="dimmed" size="sm">
                No primary AI benefit category provided.
              </Text>
            )}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th w={230}>Individuals Involved</Table.Th>
          <Table.Td>
            {project.individualsInvolved?.length ? (
              project.individualsInvolved.map((person, idx) => (
                <div key={idx}>{person}</div>
              ))
            ) : (
              <Text c="dimmed" size="sm">
                No individuals listed.
              </Text>
            )}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </>
);

export default ProjectOverviewPanel;
