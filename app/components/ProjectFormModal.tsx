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
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      status: "PILOT",
      tags: [] as string[],
      whyWeBuiltThis: "",
      whatWeveBuilt: "",
      individualsInvolved: [] as string[],
      timeline: [emptyTimelineItem(), emptyTimelineItem()],
    },
    validate: {
      title: (v) => (v ? null : "Title is required"),
      description: (v) => (v ? null : "Description is required"),
    },
  });

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
      });
    } else {
      form.setValues({
        title: "",
        description: "",
        status: "PILOT",
        tags: [],
        whyWeBuiltThis: "",
        whatWeveBuilt: "",
        individualsInvolved: [],
        timeline: [emptyTimelineItem(), emptyTimelineItem()],
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
                      "DRAFT",
                      "PILOT",
                      "ACTIVE",
                      "RETIRED",
                      "MAINTENANCE",
                    ]}
                    comboboxProps={{ withinPortal: false }}
                    {...form.getInputProps("status")}
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
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setPage(2)}
              disabled={page === 2}
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
