"use client";

import React, { useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  useEffect(() => {
    // Load saved theme preference from localStorage on mount
    const savedScheme = localStorage.getItem('mantine-color-scheme');
    if (savedScheme === 'light' || savedScheme === 'dark' || savedScheme === 'auto') {
      setColorScheme(savedScheme);
    }
  }, [setColorScheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(newScheme);
        localStorage.setItem('mantine-color-scheme', newScheme);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [colorScheme, setColorScheme]);

  return <>{children}</>;
}