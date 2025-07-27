"use client";

import React, { useState, useEffect } from 'react';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface ThemeToggleProps {
  variant?: 'subtle' | 'filled' | 'outline' | 'light' | 'default' | 'transparent' | 'gradient';
}

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleColorScheme = () => {
    const nextScheme = computedColorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(nextScheme);
    localStorage.setItem('mantine-color-scheme', nextScheme);
  };

  if (!mounted) {
    return (
      <ActionIcon
        variant={variant}
        size="lg"
        aria-label="Toggle color scheme"
        style={{ visibility: 'hidden' }}
      >
        <IconSun size="70%" stroke={1.5} />
      </ActionIcon>
    );
  }

  return (
    <Tooltip 
      label={computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      position="bottom"
    >
      <ActionIcon
        onClick={toggleColorScheme}
        variant={variant}
        size="lg"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'dark' ? (
          <IconSun size="70%" stroke={1.5} />
        ) : (
          <IconMoon size="70%" stroke={1.5} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}