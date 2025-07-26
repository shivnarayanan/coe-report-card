import React from "react";
import { Timeline, Text } from "@mantine/core";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isStepActive?: boolean;
}

interface ProjectTimelinePanelProps {
  timeline: TimelineItem[];
  activeIndex: number;
  renderBullet: (index: number) => React.ReactNode;
}

const ProjectTimelinePanel: React.FC<ProjectTimelinePanelProps> = ({ timeline, activeIndex, renderBullet }) => {
  if (!timeline.length) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No timeline data available.
      </Text>
    );
  }
  return (
    <Timeline active={activeIndex} bulletSize={24} lineWidth={2}>
      {timeline.map((item, index) => (
        <Timeline.Item
          key={item.id}
          bullet={renderBullet(index)}
          color="NomuraRed"
          lineVariant="solid"
          style={{ opacity: index > activeIndex ? 0.6 : 1 }}
          title={item.title}
        >
          <Text size="sm" c="dimmed" mt={4}>
            {item.description}
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            {item.date}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default ProjectTimelinePanel; 