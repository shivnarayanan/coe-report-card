"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Group } from "@mantine/core";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import classes from "./Header.module.css";

const links = [
  { link: "/overview", label: "All Use Cases" },
  { link: "/insights", label: "Key Insights" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Link href="/" className={classes.logo}>
          <Image
            src="/chinou.png"
            alt="Chinou Logo"
            width={210}
            height={35}
            priority
          />
        </Link>

        <Group gap="xs">
          {links.map(({ link, label }) => (
            <Link
              key={label}
              href={link}
              className={classes.link}
              data-active={pathname === link ? true : undefined}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </Group>
      </Container>
    </header>
  );
}
