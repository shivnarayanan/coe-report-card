import React from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
  Button,
  TagsInput,
  MultiSelect,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
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
  const form = useForm<{
    title: string;
    description: string;
    status: string;
    tags: string[];
    whyWeBuiltThis: string;
    whatWeveBuilt: string;
    individualsInvolved: string[];
  }>({
    initialValues: {
      title: "",
      description: "",
      status: "PILOT",
      tags: [],
      whyWeBuiltThis: "",
      whatWeveBuilt: "",
      individualsInvolved: [],
    },
    validate: {
      title: (v) => (v ? null : "Title is required"),
      description: (v) => (v ? null : "Description is required"),
    },
  });

  // Reset form when modal opens/closes or project changes
  React.useEffect(() => {
    if (opened) {
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
      title={
        project ? (
          <strong>Edit Project</strong>
        ) : (
          <strong>Add New Project</strong>
        )
      }
      centered
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
            data={["DRAFT", "PILOT", "ACTIVE", "RETIRED", "MAINTENANCE"]}
            {...form.getInputProps("status")}
          />
        </SimpleGrid>
        <Textarea
          label="Project Description"
          description="Summarize the project's purpose and scope."
          variant="filled"
          minRows={3}
          autosize
          mt="sm"
          {...form.getInputProps("description")}
        />
        <Textarea
          label="Why was this built?"
          description="Explain the motivation or problem this project addresses."
          variant="filled"
          minRows={3}
          autosize
          mt="sm"
          {...form.getInputProps("whyWeBuiltThis")}
        />
        <Textarea
          label="What has been built?"
          description="Describe the features or deliverables completed so far."
          variant="filled"
          minRows={3}
          autosize
          mt="sm"
          {...form.getInputProps("whatWeveBuilt")}
        />
        <MultiSelect
          label="Individuals Involved"
          description="Select team members or stakeholders involved in this project"
          placeholder="Search and select individuals"
          variant="filled"
          searchable
          mt="sm"
          {...form.getInputProps("individualsInvolved")}
        />
        <TagsInput
          label="Project Tags"
          description="Add relevant tags to organize and improve searchability for this project"
          placeholder="Type a tag and press Enter to add"
          variant="filled"
          value={form.values.tags}
          onChange={(tags) => form.setFieldValue("tags", tags)}
          mt="sm"
        />
        <Group justify="flex-end" mt="md" gap={0}>
          <Button variant="transparent" color="#495057" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="#CA2420" radius="sm">
            {project ? "Update" : "Add Project"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
