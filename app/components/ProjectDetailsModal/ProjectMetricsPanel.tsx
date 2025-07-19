import React from "react";
import { Text, Table } from "@mantine/core";
import { Project } from "../../types/types";

interface ProjectMetricsPanelProps {
  project: Project;
}

const ProjectMetricsPanel: React.FC<ProjectMetricsPanelProps> = ({ project }) => (
  <Table verticalSpacing="md" withTableBorder>
    <Table.Tbody>
      <Table.Tr>
        <Table.Th w={220}>Investment Required</Table.Th>
        <Table.Td>{project.investmentRequired || <Text c="dimmed">No data</Text>}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th w={220}>Expected Near-Term Monetary Benefits (3 Months)</Table.Th>
        <Table.Td>{project.expectedNearTermBenefits || <Text c="dimmed">No data</Text>}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Th w={220}>Expected Long-Term Monetary Benefits (12 Months)</Table.Th>
        <Table.Td>{project.expectedLongTermBenefits || <Text c="dimmed">No data</Text>}</Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
);

export default ProjectMetricsPanel; 