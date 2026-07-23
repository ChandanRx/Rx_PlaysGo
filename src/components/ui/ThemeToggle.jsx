"use client";

import React, { useEffect, useId, useState } from "react";
import { flushSync } from "react-dom";
import Button from "./Button";

const STORAGE_KEY = "quibly_theme";

/* The 8 sun rays — they fade + scale to 0 as the sun morphs into a moon. */
const SUN_RAYS = [
  "M12 1.4v2.4",
  "m20.3 3.7-2.5 2.5",
  "M22.6 12h-2.4",
  "M12 22.6v-2.4",
  "M1.4 12h2.4",
  "m20.3 20.3-2.5-2.5",
  "m3.7 20.3 2.5-2.5",
  "m3.7 3.7 2.5 2.5",
];

const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
};

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleId = useId();
  const clipId = `theme-toggle-clip-${toggleId}`;

  useEffect(() => {
    const nextTheme = getPreferredTheme();
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  const toggleTheme = (event) => {
    const nextTheme = theme === "light" ? "dark" : "light";

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No View Transitions support (Firefox/Safari) or reduced motion →
    // switch instantly (the body's color transition still eases the colors,
    // and the icon's own CSS transition still morphs sun ⇄ moon).
    if (typeof document.startViewTransition !== "function" || prefersReduced) {
      setTheme(nextTheme);
      applyTheme(nextTheme);
      return;
    }

    // Circular reveal grows from the center of the toggle button.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // flushSync so the transition's "new" snapshot captures the new theme
    // before the clip-path animates.
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          // Long, eased-out reveal so the new theme glides in smoothly.
          duration: 700,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="theme-toggle-btn"
    >
      {/* Animated sun ⇄ moon. The morph is driven entirely by CSS keyed off
          [data-theme="dark"] (see globals.css → .theme-toggle-icon), so it
          animates whenever the theme attribute flips. */}
      <svg
        className="theme-toggle-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            {/* Light: full square exposes the whole disc (a sun).
                Dark: a notch is carved out to leave a crescent moon. */}
            <path className="tt-clip" d="M0 0h25a1 1 0 0010 10v14H0Z" />
          </clipPath>
        </defs>
        <g stroke="currentColor" strokeLinecap="round">
          <circle
            className="tt-core"
            cx={12}
            cy={12}
            r={5}
            fill="currentColor"
            clipPath={`url(#${clipId})`}
          />
          {SUN_RAYS.map((d) => (
            <path
              key={d}
              className="tt-ray"
              d={d}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeMiterlimit={0}
              paintOrder="stroke markers fill"
            />
          ))}
        </g>
      </svg>
    </Button>
  );
};

export default ThemeToggle;
