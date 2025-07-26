"use client";

import React from 'react';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface ThemeToggleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'subtle' | 'filled' | 'outline' | 'light' | 'default' | 'transparent' | 'gradient';
}

export function ThemeToggle({ size = 'md', variant = 'default' }: ThemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false });

  const toggleColorScheme = () => {
    const nextScheme = computedColorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(nextScheme);
    localStorage.setItem('mantine-color-scheme', nextScheme);
  };

  return (
    <Tooltip 
      label={computedColorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      position="bottom"
    >
      <ActionIcon
        onClick={toggleColorScheme}
        variant={variant}
        size={size}
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