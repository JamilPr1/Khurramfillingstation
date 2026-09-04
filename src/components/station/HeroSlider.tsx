"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/assets/photos/kfs-hero.jpg?v=4",
    alt: "Khurram Filling Station PSO petrol pump at night on Sialkot Bypass, Gujranwala",
  },
  {
    src: "/assets/photos/kfs-hero-shop.jpg?v=2",
    alt: "Khurram Filling Station shop and PSO sign at sunset, Gujranwala",
  },
];

const INTERVAL_MS = 2800;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((n) => (n + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="kfs-hero-photo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          width={1200}
          height={760}
          className={i === index ? "is-on" : ""}
        />
      ))}
      <div className="kfs-hero-dots" role="tablist" aria-label="Hero photos">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1} of ${SLIDES.length}`}
            className={i === index ? "on" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
