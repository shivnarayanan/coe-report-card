import React from "react";
import {
  Modal,
  Box,
  Text,
  TextInput,
  Textarea,
  Select,
  Group,
  Button,
  TagsInput,
  MultiSelect,
  SimpleGrid,
  ActionIcon,
  Stack,
  Card,
  Checkbox,
  Tooltip,
  ScrollArea,
  NumberInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { Project, TimelineItem } from "../types/types";

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
      primaryBusinessFunction: (v) => (v ? null : "Primary Business Function is required"),
    },
  });

  // Helper to safely get union type or default
  function getOrDefault<T extends string>(
    value: any,
    allowed: readonly T[],
    fallback: T
  ): T {
    return (allowed as readonly string[]).includes(value)
      ? (value as T)
      : fallback;
  }

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

  // Reset form/page on open or project change
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
        ntiStatus: "Not Applicable" as
          | "Not Applicable"
          | "In-Progress"
          | "Completed",
        ntiLink: "",
        primaryBenefitsCategory: "Employee Productivity" as
          | "Employee Productivity"
          | "Cost Avoidance"
          | "Revenue Generation",
        primaryAIBenefitCategory: "Knowledge Management" as
          | "Knowledge Management"
          | "Code Development & Support"
          | "Content Generation"
          | "Data Analysis & Summarisation"
          | "Document Processing"
          | "Process or Workflow Automation",
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
        : null,
      expectedNearTermBenefits: values.expectedNearTermBenefits
        ? `$${values.expectedNearTermBenefits.toLocaleString()}`
        : null,
      expectedLongTermBenefits: values.expectedLongTermBenefits
        ? `$${values.expectedLongTermBenefits.toLocaleString()}`
        : null,
      primaryBusinessFunction: values.primaryBusinessFunction,
    });
    onClose();
  };

  const addTimelineItem = () => {
    form.setFieldValue("timeline", [
      ...form.values.timeline,
      emptyTimelineItem(),
    ]);
  };

  const removeTimelineItem = (index: number) => {
    form.setFieldValue(
      "timeline",
      form.values.timeline.filter((_, i) => i !== index)
    );
  };

  const updateTimelineItem = (
    index: number,
    field: keyof TimelineItem,
    value: any
  ) => {
    const updated = [...form.values.timeline];
    updated[index] = { ...updated[index], [field]: value };
    form.setFieldValue("timeline", updated);
  };

  const moveTimelineItemUp = (index: number) => {
    if (index === 0) return;
    const updated = [...form.values.timeline];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    form.setFieldValue("timeline", updated);
  };

  const moveTimelineItemDown = (index: number) => {
    if (index === form.values.timeline.length - 1) return;
    const updated = [...form.values.timeline];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    form.setFieldValue("timeline", updated);
  };

  // ... rest of the component code ...
} 