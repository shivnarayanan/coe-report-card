"use client";

import React from 'react';
import { Container } from '@mantine/core';
import classes from './PageBackground.module.css';

interface PageBackgroundProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function PageBackground({ children, size = 'xl' }: PageBackgroundProps) {
  return (
    <div className={classes.pageContainer}>
      <Container size={size}>
        {children}
      </Container>
    </div>
  );
}