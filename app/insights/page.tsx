"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Group,
  Loader,
  Center,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import { BarChart, PieChart, DonutChart } from "@mantine/charts";
import { 
  IconChecklist, 
  IconBulb,
  IconTarget,
  IconChartBar
} from "@tabler/icons-react";
import { fetchAnalyticsOverview, fetchTimelineAnalytics, AnalyticsOverview, TimelineAnalytics } from "../utils/api";

export default function InsightsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsOverview | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [overview, timeline] = await Promise.all([
          fetchAnalyticsOverview(),
          fetchTimelineAnalytics()
        ]);
        setAnalyticsData(overview);
        setTimelineData(timeline);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <Container size="xl">
        <Center style={{ height: 400 }}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl">
        <Center style={{ height: 400, flexDirection: "column" }}>
          <Title order={2} mb="md" c="red">
            Error Loading Dashboard
          </Title>
          <Text c="dimmed">{error}</Text>
        </Center>
      </Container>
    );
  }

  if (!analyticsData || !timelineData) {
    return (
      <Container size="xl">
        <Center style={{ height: 400, flexDirection: "column" }}>
          <Title order={2} mb="md">
            No Data Available
          </Title>
          <Text c="dimmed">Unable to load analytics data</Text>
        </Center>
      </Container>
    );
  }

  const statusColors = {
    'PRODUCTION': '#40c057',
    'PILOT': '#fab005',
    'POC': '#fd7e14',
    'IDEATION': '#868e96'
  };

  const statusData = analyticsData.projectsByStatus.map(item => ({
    name: item.status,
    value: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || '#868e96'
  }));

  const functionData = analyticsData.projectsByFunction.map(item => ({
    function: item.function,
    projects: item.count
  }));

  const benefitsData = analyticsData.projectsByBenefits.map(item => ({
    category: item.category,
    count: item.count
  }));

  const progressData = timelineData.projectProgress.slice(0, 10).map(project => ({
    project: project.projectTitle.length > 15 ? 
      project.projectTitle.substring(0, 15) + '...' : 
      project.projectTitle,
    progress: Math.round(project.progressPercentage),
    status: project.status
  }));

  return (
    <Container size="xl" py="md">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Total Projects</Text>
            <IconBulb size={24} color="#228be6" />
          </Group>
          <Text size="xl" fw={700} c="blue">
            {analyticsData.totalProjects}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Active Milestones</Text>
            <IconTarget size={24} color="#40c057" />
          </Group>
          <Text size="xl" fw={700} c="green">
            {analyticsData.activeMilestones}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Business Functions</Text>
            <IconChartBar size={24} color="#fd7e14" />
          </Group>
          <Text size="xl" fw={700} c="orange">
            {analyticsData.projectsByFunction.length}
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Top Tags</Text>
            <IconChecklist size={24} color="#7950f2" />
          </Group>
          <Text size="xl" fw={700} c="violet">
            {analyticsData.topTags.length}
          </Text>
        </Card>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="400">
            <Title order={4} mb="md">Projects by Status</Title>
            <PieChart
              data={statusData}
              withLabelsLine
              labelsPosition="outside"
              labelsType="percent"
              withLabels
              size={300}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="400">
            <Title order={4} mb="md">Projects by Business Function</Title>
            <BarChart
              h={300}
              data={functionData}
              dataKey="function"
              series={[{ name: 'projects', color: 'blue.6' }]}
              gridAxis="xy"
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="400">
            <Title order={4} mb="md">Benefits Categories</Title>
            <DonutChart
              data={benefitsData.map(item => ({
                name: item.category,
                value: item.count,
                color: `blue.${Math.min(item.count + 3, 9)}`
              }))}
              size={300}
              thickness={30}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="400">
            <Title order={4} mb="md">Project Progress</Title>
            <BarChart
              h={300}
              data={progressData}
              dataKey="project"
              series={[{ name: 'progress', color: 'green.6' }]}
              gridAxis="xy"
              yAxisProps={{ domain: [0, 100] }}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Top Tags</Title>
            <Group gap="xs">
              {analyticsData.topTags.slice(0, 15).map((tag, index) => (
                <Badge
                  key={tag.tag}
                  variant="light"
                  color={`blue.${Math.min(index + 4, 9)}`}
                  size="lg"
                >
                  {tag.tag} ({tag.count})
                </Badge>
              ))}
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}