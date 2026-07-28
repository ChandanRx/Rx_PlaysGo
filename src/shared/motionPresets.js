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

// Alternating entrance — even items slide in from the left, odd items from the
// right. Pass the item's index via the `custom` prop so the container's stagger
// plays them one after another in a smooth left/right/left rhythm.
export const staggerItemAlternate = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? -28 : 28,
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: springSoft,
  },
};

// Card reveal — a smooth rise-and-fade (no bounce), matching the tween the
// header/sidebar items use so cards load with the same feel as the top of the
// page. Paired on the grid with `makeSequencedContainer(loadSequence.cards, …)`
// so cards play one-by-one when the grid mounts (and replay on page change).
export const cardRevealUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: easeOut,
    },
  },
};

/* ── Initial page-load choreography ──
 * On first load the three main regions enter in sequence so the eye is led
 * down the page: left sidebar → feed toolbar (middle top) → post cards. Each
 * number is the target time (seconds after page load) when that region STARTS
 * revealing its children; children within a region still stagger among
 * themselves. The regions mount at different, data-dependent times (the toolbar
 * waits on the stored category, the grid on posts loading), so these delays are
 * anchored to a single shared page-load clock via `makeSequencedContainer` —
 * a region that mounts late gets a smaller remaining delay and catches up to
 * the schedule instead of restarting the timer from its own mount.
 */
export const loadSequence = {
  sidebar: 0.1,
  header: 0.5,
  cards: 0.85,
};

// Shared page-load clock. Lazily set on the first delay request (≈ the first
// region to mount after hydration) so it tracks real first paint, not module
// eval which can happen well before the components hydrate.
let pageLoadAt = null;

/** Remaining seconds until `targetSeconds` after page load (never negative). */
export function sequencedDelay(targetSeconds) {
  if (typeof performance === "undefined") return targetSeconds;
  if (pageLoadAt === null) pageLoadAt = performance.now();
  const elapsed = (performance.now() - pageLoadAt) / 1000;
  return Math.max(0, targetSeconds - elapsed);
}

/**
 * Build a stagger container whose children begin revealing at a page-anchored
 * time. Call once when the region actually renders (e.g. `useMemo` keyed on the
 * data flag that gates it) so it captures the remaining delay at mount, keeping
 * the sidebar → header → cards order intact regardless of mount timing.
 */
export const makeSequencedContainer = (targetSeconds, staggerChildren = 0.06) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren: sequencedDelay(targetSeconds),
    },
  },
});

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

// Modal content reveal — staggers a modal's inner blocks so they rise in one by
// one just after the dialog itself has sprung open. Uses the same `hidden` /
// `visible` state names as `modalDialog` / `modalSheet`, so a container marked
// `variants={modalStagger}` inherits the open/close state from the parent
// dialog (framer propagates variant state through the React tree) — no
// initial/animate props needed on it. Wrap each inner block in a child marked
// `variants={modalStaggerItem}`.
export const modalStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

export const modalStaggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOut },
  },
};

/* ── Chat ── */

// Message bubble — pops in from just below as it's sent or received. Used with
// AnimatePresence so each new bubble animates in; the whole list can also
// stagger these on first open via `staggerContainer`.
export const chatBubbleIn = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: easeOut },
  },
};

// Small anchored popovers — dropdown menus, notification panels.
// `pointerEvents` is toggled with the open state so a closing (or, if an exit
// animation ever fails to complete, a lingering) menu can never sit invisibly
// over the page and swallow clicks — the bug that made whole forms feel dead
// after a dropdown was opened once.
export const popIn = {
  initial: { opacity: 0, scale: 0.97, y: -4, pointerEvents: "none" },
  animate: { opacity: 1, scale: 1, y: 0, pointerEvents: "auto", transition: { duration: 0.16, ease: easeOut } },
  exit: { opacity: 0, scale: 0.98, y: -4, pointerEvents: "none", transition: { duration: 0.12, ease: "easeIn" } },
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
