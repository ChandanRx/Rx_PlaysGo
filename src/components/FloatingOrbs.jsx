"use client";

import { useEffect, useRef } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Ambient, cursor-reactive background orbs for the auth hero panels.
 *
 * - Each orb continuously drifts along its own slow, organic keyframe path
 *   (translate + subtle scale) with repeatType "mirror" so it never reads as a
 *   mechanical loop, and every orb runs on its own duration so they don't sync.
 * - The whole field eases toward the pointer (parallax) via springs and settles
 *   back to center when the cursor leaves the panel.
 * - Respects prefers-reduced-motion: renders the orbs completely static.
 * - Purely decorative and non-interactive (pointer-events-none, aria-hidden),
 *   animating only transform so it never triggers layout or blocks input.
 *
 * Mouse tracking is attached to the orbs' positioned parent (the hero <aside>),
 * so any page gets identical behavior just by dropping <FloatingOrbs /> inside a
 * `relative overflow-hidden` container — no per-page handler wiring.
 */

// Fixed, saturated colors (not theme-var greens) so the orbs actually pop
// against the lime brand panel and read as "floating colors" rather than a
// flat wash. Each orb drifts on its own path, scale, and duration.
const DEFAULT_ORBS = [
  {
    className:
      "absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[rgba(15,118,110,0.6)] blur-3xl",
    keyframes: { x: [0, 60, -34, 0], y: [0, -46, 34, 0], scale: [1, 1.16, 0.9, 1] },
    duration: 8,
    parallax: 30,
  },
  {
    className:
      "absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-[rgba(157,23,77,0.55)] blur-3xl",
    keyframes: { x: [0, -52, 32, 0], y: [0, 40, -30, 0], scale: [1, 0.88, 1.14, 1] },
    duration: 11,
    parallax: 22,
  },
  {
    className:
      "absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-[rgba(180,83,9,0.55)] blur-3xl",
    keyframes: { x: [0, 44, -50, 0], y: [0, -34, 44, 0], scale: [1, 1.14, 0.9, 1] },
    duration: 9,
    parallax: 26,
  },
  {
    className:
      "absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-[rgba(76,29,149,0.55)] blur-3xl",
    keyframes: { x: [0, -40, 48, 0], y: [0, 34, -42, 0], scale: [1, 1.15, 0.92, 1] },
    duration: 12,
    parallax: 18,
  },
  {
    className:
      "absolute -top-10 left-1/4 h-52 w-52 rounded-full bg-[rgba(30,58,138,0.5)] blur-3xl",
    keyframes: { x: [0, 38, -34, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.14, 1] },
    duration: 14,
    parallax: 14,
  },
];

const SPRING = { stiffness: 50, damping: 18, mass: 0.6 };

const Orb = ({ orb, springX, springY, reduce }) => {
  // Pointer parallax: map the smoothed -1..1 pointer position to a small px nudge.
  const x = useTransform(springX, (v) => v * orb.parallax);
  const y = useTransform(springY, (v) => v * orb.parallax);

  if (reduce) {
    return <div className={orb.className} />;
  }

  return (
    // Outer layer carries the spring-smoothed pointer parallax…
    <m.div className="absolute inset-0" style={{ x, y }}>
      {/* …inner layer carries the endless organic drift. Transforms compose. */}
      <m.div
        className={orb.className}
        animate={orb.keyframes}
        transition={{
          duration: orb.duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </m.div>
  );
};

const FloatingOrbs = ({ orbs = DEFAULT_ORBS }) => {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, SPRING);
  const springY = useSpring(my, SPRING);

  useEffect(() => {
    if (reduce) return;
    const panel = rootRef.current?.parentElement;
    if (!panel) return;

    const handleMove = (event) => {
      const rect = panel.getBoundingClientRect();
      // Normalize the pointer to -1..1 around the panel center.
      mx.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      my.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleLeave = () => {
      mx.set(0);
      my.set(0);
    };

    panel.addEventListener("mousemove", handleMove);
    panel.addEventListener("mouseleave", handleLeave);
    return () => {
      panel.removeEventListener("mousemove", handleMove);
      panel.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduce, mx, my]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {orbs.map((orb, index) => (
        <Orb key={index} orb={orb} springX={springX} springY={springY} reduce={reduce} />
      ))}
    </div>
  );
};

export default FloatingOrbs;
