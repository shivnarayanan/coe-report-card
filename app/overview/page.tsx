"use client";

import React, { Suspense } from "react";
import { Skeleton, Grid } from "@mantine/core";
import OverviewContent from "./OverviewContent";

function OverviewSkeleton() {
  return (
    <Grid>
      {[...Array(6)].map((_, i) => (
        <Grid.Col key={i} span={4}>
          <Skeleton height={220} radius="md" />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}
