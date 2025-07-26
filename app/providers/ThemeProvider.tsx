"use client";

import React, { useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    // Load saved theme preference from localStorage on mount
    const savedScheme = localStorage.getItem('mantine-color-scheme');
    if (savedScheme === 'light' || savedScheme === 'dark' || savedScheme === 'auto') {
      setColorScheme(savedScheme);
    }
  }, [setColorScheme]);

  return <>{children}</>;
}