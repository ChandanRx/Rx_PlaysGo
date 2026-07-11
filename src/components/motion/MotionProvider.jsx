"use client";

import { LazyMotion, MotionConfig, domMax } from "framer-motion";

/**
 * App-wide motion runtime.
 *
 * - LazyMotion (strict) code-splits the animation feature set: components use
 *   the lightweight `m` component and `domMax` (layout + drag + gestures)
 *   loads on demand. Strict mode throws if the full `motion` component is
 *   imported anywhere, keeping the bundle honest.
 * - MotionConfig reducedMotion="user" auto-disables transform and layout
 *   animations for users with prefers-reduced-motion, while keeping opacity
 *   fades so state changes stay visible.
 */
const MotionProvider = ({ children }) => (
  <LazyMotion features={domMax} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
);

export default MotionProvider;
