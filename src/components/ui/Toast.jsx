"use client";

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon,
} from "@heroicons/react/24/outline";

/* Lightweight toast system for the admin console. A single provider holds the
 * live stack; `useToast()` returns a `toast(message, variant)` fn plus named
 * helpers. Every surface is token-driven so it tracks light / dark / category
 * themes with no per-toast color logic. */

const ToastContext = createContext(null);

// Semantic → tokens. Default is the neutral heading ink so a plain toast still
// reads on both surfaces without borrowing a status hue.
const VARIANTS = {
  success: { icon: CheckCircleIcon,        fg: "var(--success)", soft: "var(--success-soft)", border: "var(--success)" },
  danger:  { icon: ExclamationTriangleIcon, fg: "var(--danger)",  soft: "var(--danger-soft)",  border: "var(--danger-border)" },
  info:    { icon: InformationCircleIcon,   fg: "var(--info)",    soft: "var(--info-soft)",    border: "var(--info)" },
  default: { icon: InformationCircleIcon,   fg: "var(--text-heading)", soft: "var(--bg-secondary)", border: "var(--border-strong)" },
};

const DEFAULT_DURATION = 3200;

const toastMotion = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 30 } },
  exit: { opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.14, ease: "easeIn" } },
};

const ToastRow = ({ toast, onDismiss }) => {
  const meta = VARIANTS[toast.variant] || VARIANTS.default;
  const Icon = meta.icon;
  return (
    <m.div
      layout
      {...toastMotion}
      role="status"
      className="pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-[var(--bg-card)] px-3.5 py-3 shadow-[0_10px_32px_rgba(28,32,18,0.16)]"
      style={{ borderColor: meta.border }}
    >
      <span
        aria-hidden
        className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: meta.soft, color: meta.fg }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
      </span>
      <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-snug text-[var(--text-heading)]">
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[var(--text-faint)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
      >
        <XMarkIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
    </m.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback((message, variant = "default", { duration = DEFAULT_DURATION } = {}) => {
    if (!message) return;
    const id = ++idRef.current;
    // Cap the stack so a burst of actions can't bury the screen.
    setToasts((current) => [...current, { id, message, variant }].slice(-4));
    timers.current.set(id, setTimeout(() => dismiss(id), duration));
    return id;
  }, [dismiss]);

  // Clear any pending timers on unmount.
  useEffect(() => () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  }, []);

  const api = useMemo(() => {
    const fn = (message, variant, opts) => toast(message, variant, opts);
    fn.success = (message, opts) => toast(message, "success", opts);
    fn.danger = (message, opts) => toast(message, "danger", opts);
    fn.info = (message, opts) => toast(message, "info", opts);
    fn.dismiss = dismiss;
    return fn;
  }, [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastRow key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// No-op fallback so a component using the hook outside a provider never throws.
const noop = Object.assign(() => {}, { success: () => {}, danger: () => {}, info: () => {}, dismiss: () => {} });

export const useToast = () => useContext(ToastContext) || noop;
