import React from "react";
import { SimpleGrid, Select, TextInput, NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type ProjectFormP2Props = {
  form: UseFormReturnType<any>;
  BUSINESS_FUNCTIONS: readonly string[];
};

export function ProjectFormP2({ form, BUSINESS_FUNCTIONS }: ProjectFormP2Props) {
  return (
    <SimpleGrid cols={2} spacing="md">
      <Select
        label="NTI Status"
        description="Select the NTI status."
        variant="filled"
        data={["Not Applicable", "In-Progress", "Completed"]}
        comboboxProps={{ withinPortal: false }}
        {...form.getInputProps("ntiStatus")}
      />
      <TextInput
        label="NTI Link"
        description="Provide the NTI link if available."
        variant="filled"
        {...form.getInputProps("ntiLink")}
        disabled={form.values.ntiStatus === "Not Applicable"}
      />
      <Select
        label="Primary Business Function"
        description="Select the primary business function."
        variant="filled"
        data={Array.from(BUSINESS_FUNCTIONS)}
        comboboxProps={{ withinPortal: false }}
        {...form.getInputProps("primaryBusinessFunction")}
      />
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
      <NumberInput
        label="Investment Required"
        description="Enter the total investment amount required for this project"
        prefix="USD"
        step={5000}
        thousandSeparator="," 
        variant="filled"
        allowNegative={false}
        {...form.getInputProps("investmentRequired")}
      />
      <NumberInput
        label="Expected Near-Term Monetary Benefits (3 Months)"
        description="Enter the expected monetary benefits within 3 months"
        prefix="USD"
        step={5000}
        thousandSeparator="," 
        variant="filled"
        allowNegative={false}
        {...form.getInputProps("expectedNearTermBenefits")}
      />
      <NumberInput
        label="Expected Long-Term Monetary Benefits (12 Months)"
        description="Enter the expected monetary benefits within 12 months"
        prefix="USD"
        step={5000}
        thousandSeparator="," 
        variant="filled"
        allowNegative={false}
        {...form.getInputProps("expectedLongTermBenefits")}
      />
    </SimpleGrid>
  );
} 