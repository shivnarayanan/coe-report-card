import React from "react";
import { Box, Text } from "@mantine/core";
import { Project } from "../../report/types";

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

    <Text fw={700} size="lg" style={{ color: "#C42138" }} mb="xs">
      INDIVIDUALS INVOLVED
    </Text>
    <Box mb="md">
      {project.individualsInvolved?.length ? (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {project.individualsInvolved.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : (
        <Text c="dimmed">No individuals listed.</Text>
      )}
    </Box>
  </>
);

export default ProjectOverviewPanel; 