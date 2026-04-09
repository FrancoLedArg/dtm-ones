"use client";

// Motion
import { motion, MotionValue, useTransform } from "motion/react";

// Styles
import styles from "./styles.module.scss";

export default function Character({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={styles.character}>
      <span className={styles.shadow}>{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
