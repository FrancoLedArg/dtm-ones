"use client";

// Styles
import styles from "./styles.module.scss";

export default function HeroSection() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        The name <br /> talent <br /> trusts
      </h1>
      <video
        className={styles.video}
        src="https://gpkuudzvcgjdfquuodpo.supabase.co/storage/v1/object/public/public-assets/YTDown.com_Shorts_Steph-Curry-s-shot-in-Slow-Motion-shorts_Media_iQVNOyQES0A_001_1080p.mp4"
        autoPlay
        muted
        loop
        onCanPlay={() => {
          console.log("can play");
        }}
      />
    </section>
  );
}
