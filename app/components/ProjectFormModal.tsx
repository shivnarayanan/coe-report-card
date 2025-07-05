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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Project } from "../report/types";

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
    >
  ) => void;
}

export function ProjectFormModal({
  opened,
  onClose,
  project,
  onSubmit,
}: ProjectFormModalProps) {
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
      });
    } else {
      form.reset();
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
    });
    onClose();
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
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box style={{ height: "70vh", overflowY: "auto", paddingRight: 16 }}>
          {page === 1 && (
            <>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
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
                  data={["DRAFT", "PILOT", "ACTIVE", "RETIRED", "MAINTENANCE"]}
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
            <>
              <Textarea
                label="Why was this built?"
                description="Explain the motivation or problem this project addresses."
                variant="filled"
                minRows={4}
                autosize
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
            </>
          )}
        </Box>

        <Group justify="space-between"mt="md" style={{ padding: "0 16px 16px 16px" }}>
          <Group gap="xs">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setPage(2)}
              disabled={page === 2}
              aria-label="Next page"
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
