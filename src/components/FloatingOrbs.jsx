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

// Warm "sunset" palette that harmonizes with the coral brand panel. Each orb
// both DRIFTS (x/y/scale) and CYCLES COLOR through a few warm hues, so the field
// reads as a living, color-shifting glow rather than a static wash. `colors` is
// animated on its own faster clock (`colorDuration`) so the hue visibly changes
// while the position drifts more slowly.
const DEFAULT_ORBS = [
  {
    className: "absolute -right-16 -top-20 h-80 w-80 rounded-full blur-3xl",
    colors: ["rgba(250,204,21,0.5)", "rgba(251,146,60,0.5)", "rgba(244,114,182,0.45)", "rgba(250,204,21,0.5)"],
    keyframes: { x: [0, 46, -30, 0], y: [0, -36, 26, 0], scale: [1, 1.12, 0.92, 1] },
    duration: 13,
    colorDuration: 8,
    parallax: 26,
  },
  {
    className: "absolute -bottom-24 -left-12 h-80 w-80 rounded-full blur-3xl",
    colors: ["rgba(251,113,133,0.5)", "rgba(244,114,182,0.46)", "rgba(249,115,22,0.44)", "rgba(251,113,133,0.5)"],
    keyframes: { x: [0, -42, 26, 0], y: [0, 32, -24, 0], scale: [1, 0.9, 1.12, 1] },
    duration: 16,
    colorDuration: 9,
    parallax: 20,
  },
  {
    className: "absolute left-1/3 top-1/4 h-64 w-64 rounded-full blur-3xl",
    colors: ["rgba(249,115,22,0.46)", "rgba(250,204,21,0.46)", "rgba(251,113,133,0.44)", "rgba(249,115,22,0.46)"],
    keyframes: { x: [0, 36, -38, 0], y: [0, -28, 34, 0], scale: [1, 1.1, 0.92, 1] },
    duration: 14,
    colorDuration: 7,
    parallax: 22,
  },
  {
    className: "absolute -bottom-16 right-1/4 h-56 w-56 rounded-full blur-3xl",
    colors: ["rgba(167,139,250,0.4)", "rgba(244,114,182,0.4)", "rgba(251,113,133,0.38)", "rgba(167,139,250,0.4)"],
    keyframes: { x: [0, -30, 34, 0], y: [0, 28, -32, 0], scale: [1, 1.12, 0.94, 1] },
    duration: 17,
    colorDuration: 10,
    parallax: 16,
  },
  {
    className: "absolute -top-10 left-1/4 h-52 w-52 rounded-full blur-3xl",
    colors: ["rgba(254,215,170,0.55)", "rgba(253,186,116,0.5)", "rgba(250,204,21,0.45)", "rgba(254,215,170,0.55)"],
    keyframes: { x: [0, 30, -26, 0], y: [0, 30, -24, 0], scale: [1, 0.92, 1.12, 1] },
    duration: 18,
    colorDuration: 8.5,
    parallax: 14,
  },
];

const SPRING = { stiffness: 50, damping: 18, mass: 0.6 };

const Orb = ({ orb, springX, springY, reduce }) => {
  // Pointer parallax: map the smoothed -1..1 pointer position to a small px nudge.
  const x = useTransform(springX, (v) => v * orb.parallax);
  const y = useTransform(springY, (v) => v * orb.parallax);

  // Even under reduced motion we keep a gentle color cross-fade (no movement),
  // so the panel still feels alive without any vestibular-triggering motion.
  if (reduce) {
    return (
      <m.div
        className={orb.className}
        style={{ backgroundColor: orb.colors[0] }}
        animate={{ backgroundColor: orb.colors }}
        transition={{
          duration: orb.colorDuration ?? 9,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    );
  }

  return (
    // Outer layer carries the spring-smoothed pointer parallax…
    <m.div className="absolute inset-0" style={{ x, y }}>
      {/* …inner layer carries the endless organic drift + color cycle. The
          color animates on its own faster clock so the hue visibly shifts. */}
      <m.div
        className={orb.className}
        style={{ backgroundColor: orb.colors[0] }}
        animate={{ ...orb.keyframes, backgroundColor: orb.colors }}
        transition={{
          x:     { duration: orb.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          y:     { duration: orb.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          scale: { duration: orb.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          backgroundColor: {
            duration: orb.colorDuration ?? 9,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          },
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
