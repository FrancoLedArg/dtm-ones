"use client";

// Motion
import { motion, MotionValue, useTransform } from "motion/react";

// Styles
import styles from "./styles.module.scss";

// Components
import Character from "../character";

export default function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const characters = children.split("");
  const ammount = range[1] - range[0];
  const step = ammount / children.length;

  return (
    <span className={styles.word}>
      {characters.map((character, index) => {
        // prettier-ignore
        const start = range[0] + (step * index);
        // prettier-ignore
        const end = range[0] + (step * (index + 1));

        return (
          <Character key={index} range={[start, end]} progress={progress}>
            {character}
          </Character>
        );
      })}
    </span>
  );
}
