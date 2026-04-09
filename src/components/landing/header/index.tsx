"use client";

// Next
import Link from "next/link";
import Image from "next/image";

// Styles
import styles from "./styles.module.scss";

// Components
import Button from "./button";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/assets/dtm-ones-logo.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </Link>

      <Button />
    </header>
  );
}
