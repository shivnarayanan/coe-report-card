import React from "react";
import {
  Modal,
  Box,
  Text,
  Group,
  Button,
  ActionIcon,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Project, TimelineItem } from "../types/types";
import { ProjectFormP1 } from "./ProjectFormP1";
import { ProjectFormP2 } from "./ProjectFormP2";
import { ProjectFormP3 } from "./ProjectFormP3";

interface ProjectFormModalProps {
  opened: boolean;
  onClose: () => void;
  project?: Project | null;
  onSubmit: (
    values: Pick<
      Project,
      | "title"
      | "description"
      | "status"
      | "tags"
      | "whyWeBuiltThis"
      | "whatWeveBuilt"
      | "individualsInvolved"
      | "timeline"
      | "ntiStatus"
      | "ntiLink"
      | "primaryBenefitsCategory"
      | "primaryAIBenefitCategory"
      | "investmentRequired"
      | "expectedNearTermBenefits"
      | "expectedLongTermBenefits"
      | "primaryBusinessFunction"
    >
  ) => void;
}

export function ProjectFormModal({
  opened,
  onClose,
  project,
  onSubmit,
}: ProjectFormModalProps) {
  const emptyTimelineItem = (): TimelineItem => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    title: "",
    description: "",
    date: "",
    isStepActive: false,
  });

  const [page, setPage] = React.useState(1);
  const form = useForm<{
    title: string;
    description: string;
    status: Project["status"];
    tags: string[];
    whyWeBuiltThis: string;
    whatWeveBuilt: string;
    individualsInvolved: string[];
    timeline: TimelineItem[];
    ntiStatus: Project["ntiStatus"];
    ntiLink: string;
    primaryBenefitsCategory: Project["primaryBenefitsCategory"];
    primaryAIBenefitCategory: Project["primaryAIBenefitCategory"];
    investmentRequired: number | null;
    expectedNearTermBenefits: number | null;
    expectedLongTermBenefits: number | null;
    primaryBusinessFunction: Project["primaryBusinessFunction"];
  }>({
    initialValues: {
      title: "",
      description: "",
      status: "IDEATION",
      tags: [] as string[],
      whyWeBuiltThis: "",
      whatWeveBuilt: "",
      individualsInvolved: [] as string[],
      timeline: [emptyTimelineItem(), emptyTimelineItem()],
      ntiStatus: "Not Applicable",
      ntiLink: "",
      primaryBenefitsCategory: "Employee Productivity",
      primaryAIBenefitCategory: "Knowledge Management",
      investmentRequired: 100000,
      expectedNearTermBenefits: 30000,
      expectedLongTermBenefits: 150000,
      primaryBusinessFunction: "Finance",
    },
    validate: {
      title: (v) => (v ? null : "Title is required"),
      description: (v) => (v ? null : "Description is required"),
      primaryBusinessFunction: (v) =>
        v ? null : "Primary Business Function is required",
    },
  });

  function getOrDefaultOrUndefined<T extends string>(
    value: any,
    allowed: readonly T[]
  ): T | undefined {
    return (allowed as readonly string[]).includes(value)
      ? (value as T)
      : undefined;
  }

  const NTI_STATUS = ["Not Applicable", "In-Progress", "Completed"] as const;
  const PRIMARY_BENEFITS = [
    "Employee Productivity",
    "Cost Avoidance",
    "Revenue Generation",
  ] as const;
  const PRIMARY_AI_BENEFITS = [
    "Knowledge Management",
    "Code Development & Support",
    "Content Generation",
    "Data Analysis & Summarisation",
    "Document Processing",
    "Process or Workflow Automation",
  ] as const;
  const BUSINESS_FUNCTIONS = [
    "Finance",
    "HR",
    "IT",
    "Operations",
    "Marketing",
    "Sales",
    "Other",
  ] as const;

  React.useEffect(() => {
    if (!opened) return;
    setPage(1);
    if (project) {
      form.setValues({
        title: project.title,
        description: project.description,
        status: project.status,
        tags: project.tags,
        whyWeBuiltThis: project.whyWeBuiltThis || "",
        whatWeveBuilt: project.whatWeveBuilt || "",
        individualsInvolved: project.individualsInvolved || [],
        timeline: project.timeline || [],
        ntiStatus:
          getOrDefaultOrUndefined(project.ntiStatus, NTI_STATUS) ??
          "Not Applicable",
        ntiLink: project.ntiLink || "",
        primaryBenefitsCategory:
          getOrDefaultOrUndefined(
            project.primaryBenefitsCategory,
            PRIMARY_BENEFITS
          ) ?? "Employee Productivity",
        primaryAIBenefitCategory:
          getOrDefaultOrUndefined(
            project.primaryAIBenefitCategory,
            PRIMARY_AI_BENEFITS
          ) ?? "Knowledge Management",
        investmentRequired: project.investmentRequired
          ? parseFloat(project.investmentRequired.replace(/[$,]/g, ""))
          : null,
        expectedNearTermBenefits: project.expectedNearTermBenefits
          ? parseFloat(project.expectedNearTermBenefits.replace(/[$,]/g, ""))
          : null,
        expectedLongTermBenefits: project.expectedLongTermBenefits
          ? parseFloat(project.expectedLongTermBenefits.replace(/[$,]/g, ""))
          : null,
        primaryBusinessFunction: project.primaryBusinessFunction || "Finance",
      });
    } else {
      form.setValues({
        title: "",
        description: "",
        status: "IDEATION",
        tags: [],
        whyWeBuiltThis: "",
        whatWeveBuilt: "",
        individualsInvolved: [],
        timeline: [emptyTimelineItem(), emptyTimelineItem()],
        ntiStatus: "Not Applicable",
        ntiLink: "",
        primaryBenefitsCategory: "Employee Productivity",
        primaryAIBenefitCategory: "Knowledge Management",
        investmentRequired: null,
        expectedNearTermBenefits: null,
        expectedLongTermBenefits: null,
        primaryBusinessFunction: "Finance",
      });
    }
  }, [opened, project]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit({
      ...values,
      status: values.status as Project["status"],
      tags: values.tags,
      whyWeBuiltThis: values.whyWeBuiltThis,
      whatWeveBuilt: values.whatWeveBuilt,
      individualsInvolved: values.individualsInvolved,
      timeline: values.timeline,
      ntiStatus: values.ntiStatus,
      ntiLink: values.ntiLink,
      primaryBenefitsCategory: values.primaryBenefitsCategory,
      primaryAIBenefitCategory: values.primaryAIBenefitCategory,
      investmentRequired: values.investmentRequired
        ? `$${values.investmentRequired.toLocaleString()}`
        : "",
      expectedNearTermBenefits: values.expectedNearTermBenefits
        ? `$${values.expectedNearTermBenefits.toLocaleString()}`
        : "",
      expectedLongTermBenefits: values.expectedLongTermBenefits
        ? `$${values.expectedLongTermBenefits.toLocaleString()}`
        : "",
      primaryBusinessFunction: values.primaryBusinessFunction,
    });
    onClose();
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      date: "",
      isStepActive: false,
    };
    form.setFieldValue("timeline", [...form.values.timeline, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    const newTimeline = form.values.timeline.filter((_, i) => i !== index);
    form.setFieldValue("timeline", newTimeline);
  };

  const updateTimelineItem = (
    index: number,
    field: keyof TimelineItem,
    value: any
  ) => {
    const newTimeline = [...form.values.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    if (field === "isStepActive" && value === true) {
      newTimeline.forEach((item, i) => {
        if (i !== index) {
          item.isStepActive = false;
        }
      });
    }
    form.setFieldValue("timeline", newTimeline);
  };

  const moveTimelineItemUp = (index: number) => {
    if (index === 0) return;
    const newTimeline = [...form.values.timeline];
    [newTimeline[index - 1], newTimeline[index]] = [
      newTimeline[index],
      newTimeline[index - 1],
    ];
    form.setFieldValue("timeline", newTimeline);
  };

  const moveTimelineItemDown = (index: number) => {
    if (index === form.values.timeline.length - 1) return;
    const newTimeline = [...form.values.timeline];
    [newTimeline[index], newTimeline[index + 1]] = [
      newTimeline[index + 1],
      newTimeline[index],
    ];
    form.setFieldValue("timeline", newTimeline);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      zIndex={1100}
      centered
      title={
        <Text fw={700} size="lg">
          {project ? "Edit Project" : "Add New Project"}
        </Text>
      }
      withCloseButton
      style={{ overflow: "hidden" }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box style={{ height: "70vh", overflowY: "auto" }}>
          <ScrollArea type="auto" offsetScrollbars>
            {page === 1 && <ProjectFormP1 form={form} />}
            {page === 2 && (
              <ProjectFormP2
                form={form}
                BUSINESS_FUNCTIONS={BUSINESS_FUNCTIONS}
              />
            )}
            {page === 3 && (
              <ProjectFormP3
                form={form}
                addTimelineItem={addTimelineItem}
                removeTimelineItem={removeTimelineItem}
                updateTimelineItem={updateTimelineItem}
                moveTimelineItemUp={moveTimelineItemUp}
                moveTimelineItemDown={moveTimelineItemDown}
              />
            )}
          </ScrollArea>
        </Box>
        <Group justify="space-between" mt="md">
          <Group gap="xs">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setPage(page + 1)}
              disabled={page === 3}
            >
              <IconArrowRight size={20} />
            </ActionIcon>
          </Group>
          <Group gap={0}>
            <Button variant="transparent" color="#495057" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="#CA2420" radius="sm">
              {project ? "Update" : "Add Project"}
            </Button>
          </Group>
        </Group>
      </form>
    </Modal>
  );
}
