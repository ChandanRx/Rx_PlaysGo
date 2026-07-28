"use client";

import { useEffect, useState } from "react";

/**
 * Returns the variant name to feed a motion component's `animate` prop:
 * "hidden" on the very first render, then "show" right after mount.
 *
 * Page content lives inside AppShell's `<AnimatePresence initial={false}>`,
 * which suppresses enter animations on the first app load (they only played
 * when navigating back to a page). Driving `animate` from post-mount state turns
 * the entrance into a state change, which presence-initial does NOT gate — so
 * the content animates on a cold load too.
 *
 * Usage:
 *   const reveal = useMountReveal();
 *   <m.div variants={container} initial="hidden" animate={reveal}> … </m.div>
 */
export function useMountReveal(shownState = "show", hiddenState = "hidden") {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setRevealed(true), []);
  return revealed ? shownState : hiddenState;
}
