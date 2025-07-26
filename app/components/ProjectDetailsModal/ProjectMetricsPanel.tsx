import React from "react";
import {
  Text,
  Group,
  Card,
  Stack,
  ThemeIcon,
  SimpleGrid,
  Box,
} from "@mantine/core";
import {
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { Project } from "../../types/types";

interface ProjectMetricsPanelProps {
  project: Project;
}

const ProjectMetricsPanel: React.FC<ProjectMetricsPanelProps> = ({
  project,
}) => {
  // Helper function to format currency
  const formatCurrency = (value: string | undefined) => {
    if (!value) return "N/A";
    if (value.startsWith("USD")) return value;
    if (value.startsWith("$")) return value;
    return `$${value}`;
  };

  // Helper function to calculate ROI
  const calculateROI = () => {
    const investment = project.investmentRequired
      ? parseFloat(project.investmentRequired.replace(/[$,]/g, ""))
      : 0;
    const nearTerm = project.expectedNearTermBenefits
      ? parseFloat(project.expectedNearTermBenefits.replace(/[$,]/g, ""))
      : 0;
    const longTerm = project.expectedLongTermBenefits
      ? parseFloat(project.expectedLongTermBenefits.replace(/[$,]/g, ""))
      : 0;

    if (investment === 0) return "N/A";

    const totalBenefits = nearTerm + longTerm;
    const roi = ((totalBenefits - investment) / investment) * 100;
    return `${roi.toFixed(1)}%`;
  };

  const investment = formatCurrency(project.investmentRequired);
  const nearTermBenefits = formatCurrency(project.expectedNearTermBenefits);
  const longTermBenefits = formatCurrency(project.expectedLongTermBenefits);
  const roi = calculateROI();

  return (
    <Stack gap="lg">

      {/* Summary Section */}
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}
      >
        <Group justify="space-between" align="center" mb="md">
          <Text fw={600} size="lg">
            Financial Metrics
          </Text>
          <ThemeIcon
            size="md"
            radius="xl"
            color="NomuraRed"
          >
            <IconCurrencyDollar size={16} />
          </ThemeIcon>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Box>
            <Text size="sm" c="dimmed">
              Initial Investment
            </Text>
            <Text fw={600} size="lg">
              {investment}
            </Text>
          </Box>
          <Box>
            <Text size="sm" c="dimmed">
              Expected Benefits (3 Months)
            </Text>
            <Text fw={600} size="lg" c="green">
              {formatCurrency(project.expectedNearTermBenefits)}
            </Text>
          </Box>
          <Box>
            <Text size="sm" c="dimmed">
              Expected Benefits (12 Months)
            </Text>
            <Text fw={600} size="lg" c="green">
              {formatCurrency(project.expectedLongTermBenefits)}
            </Text>
          </Box>
        </SimpleGrid>
      </Card>
    </Stack>
  );
};

export default ProjectMetricsPanel;
