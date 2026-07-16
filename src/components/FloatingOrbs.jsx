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

const DEFAULT_ORBS = [
  {
    className:
      "absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--secondary)]/40 blur-3xl",
    keyframes: { x: [0, 26, -14, 0], y: [0, -22, 16, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 8,
    parallax: 28,
  },
  {
    className:
      "absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl",
    keyframes: { x: [0, -24, 14, 0], y: [0, 18, -12, 0], scale: [1, 0.95, 1.07, 1] },
    duration: 11,
    parallax: 20,
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
