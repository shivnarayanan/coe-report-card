import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { theme } from "../theme";
import { Header } from "@components/Header/Header";
import { ThemeProvider } from "./providers/ThemeProvider";

export const metadata = {
  title: "CHINOU",
  description: "",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/chinou-icon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ThemeProvider>
            <Notifications position="top-right" zIndex={10000} />
            <Header />
            {children}
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
