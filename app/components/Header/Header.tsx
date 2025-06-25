"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Group } from "@mantine/core";
import classes from "./Header.module.css";

const links = [
  { link: "/report", label: "Report Card" },
  { link: "/usage", label: "Usage Metrics" },
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
        </Group>
      </Container>
    </header>
  );
}
