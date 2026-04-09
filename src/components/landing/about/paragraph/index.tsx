"use client";

// React
import { useRef } from "react";

// Motion
import { motion, useScroll, useTransform } from "motion/react";

// Styles
import styles from "./styles.module.scss";

// Components
import Word from "../word";
import Character from "../character";

export default function Paragraph({ value }: { value: string }) {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["start end", "start 0.35"],
  });

  const words = value.split(" ");

  return (
    <h2 ref={element} className={styles.title}>
      {words.map((word, index) => {
        const start = index / words.length;
        // prettier-ignore
        const end = start + (1 / words.length);

        return (
          <Word key={index} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </h2>
  );
}
