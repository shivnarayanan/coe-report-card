"use client";

import React from "react";
import {
  Container,
  Title,
  Text,
  Center,
} from "@mantine/core";

export default function InsightsPage() {
  return (
    <Container size="xl">
      <Center style={{ height: 400, flexDirection: "column" }}>
        <Title order={2} mb="md">
          Project Insights
        </Title>
        <Text size="lg" c="dimmed">
          Coming Soon
        </Text>
      </Center>
    </Container>
  );
}