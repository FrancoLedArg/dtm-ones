"use client";

// React
import { useState, useEffect } from "react";

// Lenis
import { ReactLenis, useLenis } from "lenis/react";

// Motion
import { AnimatePresence } from "motion/react";

// Components
import Loader from "@/components/landing/loader";
// import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Clients from "@/components/landing/clients";

// TODO: Landing Page

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.cursor = "default";
    }, 6000);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      {
        // <AnimatePresence mode="wait">{isLoading && <Loader />}</AnimatePresence>
      }

      <Hero />
      <About />
      <Clients />
    </ReactLenis>
  );
}
