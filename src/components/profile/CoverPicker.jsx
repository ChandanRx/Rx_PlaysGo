"use client";

import React, { useEffect } from "react";
import { m } from "framer-motion";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { backdropFade, modalDialog, springSnappy } from "../../shared/motionPresets";
import { COVER_PHOTOS } from "../../shared/coverPhotos";

/**
 * Full-screen modal that lets you pick one of the eight ready-made profile
 * covers. Selecting a cover applies it immediately (via onSelect) and closes —
 * same "instant save" feel as the avatar picker in Settings.
 */
const CoverPicker = ({ value, onSelect, onClose }) => {
  // Lock body scroll + wire Escape to close, matching EditProfileModal.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handlePick = (cover) => {
    onSelect?.(cover.url);
    onClose?.();
  };

  return (
    <>
      <m.div
        {...backdropFade}
        className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 z-[101] flex items-end justify-center p-3 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cover-picker-title"
          variants={modalDialog}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(28,32,18,0.18)] sm:max-w-lg"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <div>
              <h2 id="cover-picker-title" className="text-[16px] font-black text-[var(--text-heading)]">
                Choose a cover
              </h2>
              <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                Pick one of eight banners — it saves instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-faint)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <div
            role="radiogroup"
            aria-label="Choose a cover"
            className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-5"
          >
            {COVER_PHOTOS.map((cover) => {
              const selected = value === cover.url;
              return (
                <m.button
                  key={cover.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`Cover: ${cover.name}`}
                  onClick={() => handlePick(cover)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springSnappy}
                  className={`group relative aspect-[16/7] overflow-hidden rounded-xl outline-none transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                    selected
                      ? "ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--bg-card)] shadow-[0_10px_28px_rgba(28,32,18,0.16)]"
                      : "ring-1 ring-[var(--border-subtle)] hover:shadow-[0_10px_28px_rgba(28,32,18,0.12)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />

                  {selected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--text-heading)] shadow-[0_2px_6px_rgba(28,32,18,0.3)] ring-2 ring-[var(--bg-card)]">
                      <CheckIcon className="h-3.5 w-3.5 text-[var(--bg-card)]" strokeWidth={3} />
                    </span>
                  )}

                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-2.5 py-1.5 text-left text-[11px] font-bold text-white">
                    {cover.name}
                  </span>
                </m.button>
              );
            })}
          </div>
        </m.div>
      </div>
    </>
  );
};

export default CoverPicker;
