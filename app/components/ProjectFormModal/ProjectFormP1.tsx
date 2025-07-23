import React from "react";
import { SimpleGrid, TextInput, Select, Textarea, MultiSelect, TagsInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type ProjectFormP1Props = {
  form: UseFormReturnType<any>;
};

export function ProjectFormP1({ form }: ProjectFormP1Props) {
  return (
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
          data={["PILOT", "POC", "IDEATION"]}
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
  );
} 