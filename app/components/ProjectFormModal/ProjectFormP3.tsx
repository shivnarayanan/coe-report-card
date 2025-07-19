import React from "react";
import { Stack, Card, Group, Text, Checkbox, Tooltip, ActionIcon, SimpleGrid, TextInput, Textarea, Button } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconChevronUp, IconChevronDown, IconTrash, IconPlus } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { TimelineItem } from "../../types/types";

type ProjectFormP3Props = {
  form: UseFormReturnType<any>;
  addTimelineItem: () => void;
  removeTimelineItem: (index: number) => void;
  updateTimelineItem: (index: number, field: keyof TimelineItem, value: any) => void;
  moveTimelineItemUp: (index: number) => void;
  moveTimelineItemDown: (index: number) => void;
};

export function ProjectFormP3({ form, addTimelineItem, removeTimelineItem, updateTimelineItem, moveTimelineItemUp, moveTimelineItemDown }: ProjectFormP3Props) {
  return (
    <Stack gap="md">
      {form.values.timeline.map((item: TimelineItem, index: number) => (
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
                      disabled={index === form.values.timeline.length - 1}
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
                updateTimelineItem(index, "description", e.target.value)
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
  );
} 