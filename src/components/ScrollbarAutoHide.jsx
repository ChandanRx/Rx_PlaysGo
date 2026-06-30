"use client";

import { useEffect } from "react";

const ScrollbarAutoHide = () => {
  useEffect(() => {
    const SCROLL_HIDE_DELAY = 1500;

    const setupScrollAutoHide = (el) => {
      if (!el || el.dataset.scrollbarSetup) return;
      el.dataset.scrollbarSetup = "true";
      el.classList.add("scrollbar-auto-hide");

      let hideTimer;
      const onScroll = () => {
        el.classList.add("scrolling");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => el.classList.remove("scrolling"), SCROLL_HIDE_DELAY);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      el._scrollbarCleanup = () => {
        el.removeEventListener("scroll", onScroll);
        clearTimeout(hideTimer);
      };
    };

    const walk = (node) => {
      if (node.nodeType === 1) {
        const style = window.getComputedStyle(node);
        const overflow = style.overflow + style.overflowY + style.overflowX;
        if (overflow.includes("auto") || overflow.includes("scroll")) {
          setupScrollAutoHide(node);
        }
        for (const child of node.children) walk(child);
      }
    };

    walk(document.body);

    const observer = new MutationObserver(() => walk(document.body));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll("[data-scrollbar-setup]").forEach((el) => {
        el._scrollbarCleanup?.();
        el.classList.remove("scrollbar-auto-hide", "scrolling");
        delete el.dataset.scrollbarSetup;
      });
    };
  }, []);

  return null;
};

export default ScrollbarAutoHide;
