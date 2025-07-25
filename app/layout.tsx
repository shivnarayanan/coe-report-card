import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { theme } from "../theme";
import { Header } from "@components/Header/Header";

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
      <body style={{ backgroundColor: '#f8f9fa' }}>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" zIndex={10000} />
          <Header />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
