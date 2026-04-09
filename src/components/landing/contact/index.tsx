"use client";

// Next
import Link from "next/link";

// Phosphor
import {
  InstagramLogoIcon,
  TiktokLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

// Styles
import styles from "./styles.module.scss";

export default function Contact() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.subtitle}>
          We're always open to meaningful conversations about basketball,
          careers, and opportunities.
        </p>
      </div>

      <div className={styles.form}>
        <form>Here goes the form</form>
      </div>

      <div className={styles.socials}>
        <h3 className={styles.title}>Our Socials</h3>
        <div className={styles.icons}>
          <Link href="#" target="_blank" className={styles.item}>
            <InstagramLogoIcon size={24} />
          </Link>

          <Link href="#" target="_blank" className={styles.item}>
            <TiktokLogoIcon size={24} />
          </Link>

          <Link href="#" target="_blank" className={styles.item}>
            <YoutubeLogoIcon size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}
