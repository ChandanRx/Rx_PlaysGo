/**
 * PlaysGo shared motion system.
 *
 * Every animation in the app is defined here once and imported where needed —
 * components never declare inline animation objects. All presets animate only
 * GPU-friendly properties (opacity / transform).
 *
 * Rendering is done with the `m` component (via <MotionProvider> + LazyMotion)
 * so the animation runtime is code-split out of the main bundle.
 * `MotionConfig reducedMotion="user"` in MotionProvider disables transform
 * animations globally for users who prefer reduced motion.
 */

/* ── Transitions ── */

// Fast, confident spring — active pills, tabs, small UI state changes.
export const springSnappy = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// Softer spring — dialogs, sheets, larger surfaces.
export const springSoft = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

// Standard decel curve for tween-based entrances.
export const easeOut = [0.22, 1, 0.36, 1];

// Shared tween used by entrance variants.
export const tweenFast = {
  duration: 0.3,
  ease: easeOut,
};

// Quick fade for overlays/backdrops.
export const tweenFade = {
  duration: 0.18,
  ease: "easeOut",
};

/* ── Reusable variants ── */

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: easeOut,
    },
  },
};

/* ── Route transitions ── */

// Horizontal cross-fade between routes (AppShell page container).
export const pageTransition = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -14 },
  transition: { duration: 0.22, ease: "easeInOut" },
};

/* ── Overlay / modal variants ── */

// Dimmed blur backdrop behind modals and sheets.
export const backdropFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: tweenFade },
  exit: { opacity: 0, transition: tweenFade },
};

// Centered dialog — desktop modals and confirm dialogs.
export const modalDialog = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springSoft },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};

// Bottom sheet — mobile modals.
export const modalSheet = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

// Small anchored popovers — dropdown menus, notification panels.
export const popIn = {
  initial: { opacity: 0, scale: 0.97, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: easeOut } },
  exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
};

/* ── Gesture presets (whileHover / whileTap) ── */

// Press feedback for buttons and cards.
export const tapScale = { scale: 0.96 };

// Stronger press for small icon buttons.
export const tapScaleSmall = { scale: 0.9 };

// Gentle grow on hover — icon buttons, small CTAs.
export const hoverScale = { scale: 1.04 };

// Larger grow for compact icon-only targets.
export const hoverScaleIcon = { scale: 1.1 };

/* ── Helper ── */

/**
 * Neutralizes a motion-props object when the user prefers reduced motion.
 * Use with `useReducedMotion()` for one-off prop bundles that bypass the
 * global MotionConfig (e.g. dynamically built animate targets).
 */
export function getMotionProps(reduceMotion, props) {
  if (reduceMotion) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: {
        duration: 0,
      },
    };
  }

  return props;
}
