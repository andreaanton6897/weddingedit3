"use client";

import { useEffect, useState } from "react";

const COLOURS = ["#d4c19c", "#a68a5b", "#6b775f", "#161311", "#e6dfd3"];

type Fleck = { left: number; delay: number; dur: number; drift: number; colour: string; round: boolean };

/** A brief fall of champagne-coloured flecks for milestone moments. Skipped if the visitor prefers reduced motion. */
export function Celebration({ count = 42 }: { count?: number }) {
  const [flecks, setFlecks] = useState<Fleck[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random layout generated once in the browser
    setFlecks(
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        dur: 2.6 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 160,
        colour: COLOURS[i % COLOURS.length],
        round: i % 3 === 0,
      })),
    );
    const t = setTimeout(() => setFlecks([]), 5200);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {flecks.map((f, i) => (
        <span
          key={i}
          className="fleck"
          style={{
            left: `${f.left}%`,
            background: f.colour,
            borderRadius: f.round ? "999px" : "1px",
            ["--delay" as string]: `${f.delay}s`,
            ["--dur" as string]: `${f.dur}s`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
