import { createTheme, MantineColorsTuple } from "@mantine/core";

const NomuraRed: MantineColorsTuple = [
  "#ffebea",
  "#fcd6d5",
  "#f1aba9",
  "#e97d7b",
  "#e15752",
  "#dd3e39",
  "#dc302c",
  "#c4231f",
  "#af1c1b",
  "#9a1114",
];

export const theme = createTheme({
  primaryColor: "NomuraRed",
  colors: {
    NomuraRed,
  },
  defaultRadius: 'md',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});