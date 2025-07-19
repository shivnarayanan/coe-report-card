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
    status: Project['status'];
    tags: string[];
    whyWeBuiltThis: string;
    whatWeveBuilt: string;
    individualsInvolved: string[];
    timeline: TimelineItem[];
    ntiStatus: Project['ntiStatus'];
    ntiLink: string;
    primaryBenefitsCategory: Project['primaryBenefitsCategory'];
    primaryAIBenefitCategory: Project['primaryAIBenefitCategory'];
    investmentRequired: number | null;
    expectedNearTermBenefits: number | null;
    expectedLongTermBenefits: number | null;
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
      ntiStatus: 'Not Applicable',
      ntiLink: "",
      primaryBenefitsCategory: 'Employee Productivity',
      primaryAIBenefitCategory: 'Knowledge Management',
      investmentRequired: 100000,
      expectedNearTermBenefits: 30000,
      expectedLongTermBenefits: 150000,
    },
    validate: {
      title: (v) => (v ? null : "Title is required"),
      description: (v) => (v ? null : "Description is required"),
    },
  });

  // Helper to safely get union type or default
  function getOrDefault<T extends string>(value: any, allowed: readonly T[], fallback: T): T {
    return (allowed as readonly string[]).includes(value) ? value as T : fallback;
  }

  function getOrDefaultOrUndefined<T extends string>(value: any, allowed: readonly T[]): T | undefined {
    return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
  }

  const NTI_STATUS = (['Not Applicable', 'In-Progress', 'Completed'] as const);
  const PRIMARY_BENEFITS = (['Employee Productivity', 'Cost Avoidance', 'Revenue Generation'] as const);
  const PRIMARY_AI_BENEFITS = ([
    'Knowledge Management',
    'Code Development & Support',
    'Content Generation',
    'Data Analysis & Summarisation',
    'Document Processing',
    'Process or Workflow Automation',
  ] as const);

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
        ntiStatus: getOrDefaultOrUndefined(project.ntiStatus, NTI_STATUS) ?? 'Not Applicable',
        ntiLink: project.ntiLink || "",
        primaryBenefitsCategory: getOrDefaultOrUndefined(project.primaryBenefitsCategory, PRIMARY_BENEFITS) ?? 'Employee Productivity',
        primaryAIBenefitCategory: getOrDefaultOrUndefined(project.primaryAIBenefitCategory, PRIMARY_AI_BENEFITS) ?? 'Knowledge Management',
        investmentRequired: project.investmentRequired ? parseFloat(project.investmentRequired.replace(/[$,]/g, '')) : null,
        expectedNearTermBenefits: project.expectedNearTermBenefits ? parseFloat(project.expectedNearTermBenefits.replace(/[$,]/g, '')) : null,
        expectedLongTermBenefits: project.expectedLongTermBenefits ? parseFloat(project.expectedLongTermBenefits.replace(/[$,]/g, '')) : null,
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
        ntiStatus: 'Not Applicable' as 'Not Applicable' | 'In-Progress' | 'Completed',
        ntiLink: "",
        primaryBenefitsCategory: 'Employee Productivity' as 'Employee Productivity' | 'Cost Avoidance' | 'Revenue Generation',
        primaryAIBenefitCategory: 'Knowledge Management' as 'Knowledge Management' | 'Code Development & Support' | 'Content Generation' | 'Data Analysis & Summarisation' | 'Document Processing' | 'Process or Workflow Automation',
        investmentRequired: null,
        expectedNearTermBenefits: null,
        expectedLongTermBenefits: null,
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
      investmentRequired: values.investmentRequired ? `$${values.investmentRequired.toLocaleString()}` : "",
      expectedNearTermBenefits: values.expectedNearTermBenefits ? `$${values.expectedNearTermBenefits.toLocaleString()}` : "",
      expectedLongTermBenefits: values.expectedLongTermBenefits ? `$${values.expectedLongTermBenefits.toLocaleString()}` : "",
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

    // If setting an item as active, uncheck all other items
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
            {page === 1 && (
              <>
                <SimpleGrid cols={2}>
                  <TextInput
                    label="Project Title"
                    description="Enter a short, descriptive project name."
                    variant="filled"
                    {...form.getInputProps("title")}
                  />
                  <Select
                    label="Status"
                    description="Select the current status of the project."
                    variant="filled"
                    data={[
                      "PILOT",
                      "PROOF-OF-CONCEPT",
                      "IDEATION",
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    {...form.getInputProps("status")}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mt="sm">
                  <Select
                    label="NTI Status"
                    description="Select the NTI status."
                    variant="filled"
                    data={[
                      "Not Applicable",
                      "In-Progress",
                      "Completed",
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    {...form.getInputProps("ntiStatus")}
                  />
                  <TextInput
                    label="NTI Link"
                    description="Provide the NTI link if available."
                    variant="filled"
                    {...form.getInputProps("ntiLink")}
                    disabled={form.values.ntiStatus === 'Not Applicable'}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mt="sm">
                  <Select
                    label="Primary Benefits Category"
                    description="Select the primary benefits category."
                    variant="filled"
                    data={[
                      "Employee Productivity",
                      "Cost Avoidance",
                      "Revenue Generation",
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    {...form.getInputProps("primaryBenefitsCategory")}
                  />
                  <Select
                    label="Primary AI Benefit Category"
                    description="Select the primary AI benefit category."
                    variant="filled"
                    data={[
                      "Knowledge Management",
                      "Code Development & Support",
                      "Content Generation",
                      "Data Analysis & Summarisation",
                      "Document Processing",
                      "Process or Workflow Automation",
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    {...form.getInputProps("primaryAIBenefitCategory")}
                  />
                </SimpleGrid>

                <Textarea
                  label="Project Description"
                  description="Summarize the project's purpose and scope."
                  variant="filled"
                  minRows={4}
                  autosize
                  mt="sm"
                  {...form.getInputProps("description")}
                />

                <Textarea
                  label="Why was this built?"
                  description="Explain the motivation or problem this project addresses."
                  variant="filled"
                  minRows={4}
                  autosize
                  mt="sm"
                  {...form.getInputProps("whyWeBuiltThis")}
                />

                <Textarea
                  label="What has been built?"
                  description="Describe the features or deliverables completed so far."
                  variant="filled"
                  minRows={4}
                  autosize
                  mt="sm"
                  {...form.getInputProps("whatWeveBuilt")}
                />

                <MultiSelect
                  label="Individuals Involved"
                  description="Select team members or stakeholders involved in this project."
                  placeholder="Type to select..."
                  variant="filled"
                  searchable
                  mt="sm"
                  {...form.getInputProps("individualsInvolved")}
                />

                <TagsInput
                  label="Project Tags"
                  description="Add up to 3 relevant tags to organize and improve searchability."
                  placeholder="Type and press Enter to add tags"
                  variant="filled"
                  value={form.values.tags}
                  onChange={(tags) => {
                    if (tags.length <= 3) form.setFieldValue("tags", tags);
                  }}
                  mt="sm"
                />
              </>
            )}

            {page === 2 && (
              <Stack gap="lg">
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <Text fw={600} size="lg" mb="md">
                    Financial Metrics
                  </Text>
                  
                  <Stack gap="md">
                    <NumberInput
                      label="Investment Required"
                      description="Enter the total investment amount required for this project"
                      prefix="$"
                      step={5000}
                      thousandSeparator=","
                      variant="filled"
                      allowNegative={false}
                      {...form.getInputProps('investmentRequired')}
                    />
                    
                    <NumberInput
                      label="Expected Near-Term Monetary Benefits (3 Months)"
                      description="Enter the expected monetary benefits within 3 months"
                      prefix="$"
                      step={5000}
                      thousandSeparator=","
                      variant="filled"
                      allowNegative={false}
                      {...form.getInputProps('expectedNearTermBenefits')}
                    />
                    
                    <NumberInput
                      label="Expected Long-Term Monetary Benefits (12 Months)"
                      description="Enter the expected monetary benefits within 12 months"
                      prefix="$"
                      step={5000}
                      thousandSeparator=","
                      variant="filled"
                      allowNegative={false}
                      {...form.getInputProps('expectedLongTermBenefits')}
                    />
                  </Stack>
                </Card>
              </Stack>
            )}

            {page === 3 && (
              <Stack gap="md">
                {form.values.timeline.map((item, index) => (
                  <Card key={item.id} withBorder p="md">
                    <Stack gap="sm">
                      <Group justify="space-between" align="flex-start">
                        <Group>
                          <Text fw={500}>Timeline Event {index + 1}</Text>
                          <Checkbox
                            label="Set Active"
                            checked={item.isStepActive}
                            color="#CA2420"
                            onChange={(e) =>
                              updateTimelineItem(
                                index,
                                "isStepActive",
                                e.currentTarget.checked
                              )
                            }
                          />
                        </Group>

                        <Group gap="md">
                          <Group gap={4}>
                            <Tooltip label="Move Up" withArrow withinPortal={false}>
                              <ActionIcon
                                variant="default"
                                onClick={() => moveTimelineItemUp(index)}
                                disabled={index === 0}
                              >
                                <IconChevronUp size={25} stroke={1.5} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Move Down" withArrow withinPortal={false}>
                              <ActionIcon
                                variant="default"
                                onClick={() => moveTimelineItemDown(index)}
                                disabled={
                                  index === form.values.timeline.length - 1
                                }
                              >
                                <IconChevronDown size={25} stroke={1.5} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                          <Tooltip label="Delete Event" withArrow withinPortal={false}>
                            <ActionIcon
                              variant="transparent"
                              color="#CA2420"
                              onClick={() => removeTimelineItem(index)}
                            >
                              <IconTrash size={25} stroke={1.5} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>

                      <SimpleGrid cols={2}>
                        <TextInput
                          label="Title"
                          placeholder="Enter milestone title"
                          variant="filled"
                          value={item.title}
                          onChange={(e) =>
                            updateTimelineItem(index, "title", e.target.value)
                          }
                        />

                        <DatePickerInput
                          label="Date"
                          placeholder="Select date"
                          variant="filled"
                          value={item.date ? new Date(item.date) : null}
                          onChange={(dateString: string | null) => {
                            updateTimelineItem(index, "date", dateString || "");
                          }}
                          clearable
                          popoverProps={{ withinPortal: true }}
                          allowDeselect
                        />
                      </SimpleGrid>

                      <Textarea
                        label="Description"
                        placeholder="Describe this milestone or event"
                        variant="filled"
                        minRows={3}
                        autosize
                        value={item.description}
                        onChange={(e) =>
                          updateTimelineItem(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </Stack>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  color="#CA2420"
                  leftSection={<IconPlus size={16} />}
                  onClick={addTimelineItem}
                  fullWidth
                >
                  Add Timeline Event
                </Button>
              </Stack>
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
