"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BoltIcon, CheckBadgeIcon, ClockIcon, MapPinIcon,
} from "@heroicons/react/24/solid";
import {
  CalendarIcon, ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon,
  FlagIcon as FlagOutlineIcon,
  MapPinIcon as MapPinOutlineIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { FlagIcon } from "@heroicons/react/24/solid";
import { m, AnimatePresence } from "framer-motion";
import { DEFAULT_CATEGORY_ICON, SUBCATEGORY_ICONS } from "../shared/lucideIcons";
import { dummyUser, getUsernameForPost } from "../shared/dummyPosts";
import { distanceLabel } from "../shared/geo";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { REPORTS_CHANGE_EVENT, hasReportedPost } from "../shared/adminReports";
import { getStoredSession } from "../shared/authSession";
import {
  fadeUp, hoverScaleIcon, tapScaleSmall, tweenFast,
} from "../shared/motionPresets";
import Button from "./ui/Button";

/* ── helpers ── */
const getCategoryThemeClass = (c) => {
  if (c === "Players")    return "category-theme--players";
  if (c === "Local Help") return "category-theme--local-help";
  if (c === "For Sale")   return "category-theme--for-sale";
  return "";
};

const getPrimaryLabel = (category) => {
  if (category === "For Sale")   return "View Details";
  if (category === "Local Help") return "Request Help";
  return "Contact";
};

const getPrimaryIcon = (category) => {
  if (category === "Players") return ChatBubbleLeftRightIcon;
  return UserPlusIcon;
};

const formatChipDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

// Combines the post's date + time into a real Date so we can compute a
// "starts in / started" countdown chip.
const getEventDateTime = (post) => {
  if (!post?.date) return null;
  const d = new Date(`${post.date} ${post.time || ""}`.trim());
  return Number.isNaN(d.getTime()) ? null : d;
};

const getRemainingLabel = (post) => {
  const dt = getEventDateTime(post);
  if (!dt) return null;
  const diffMs = dt.getTime() - Date.now();
  const past = diffMs < 0;
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);
  const unit = minutes < 60 ? `${Math.max(minutes, 1)}m` : hours < 24 ? `${hours}h` : `${days}d`;
  return past ? `${unit} ago` : `${unit} left`;
};

const getChips = (post) => {
  const chips = [];
  const dateLabel = formatChipDate(post?.date);
  if (dateLabel)      chips.push({ icon: CalendarIcon, label: dateLabel });
  if (post?.time)     chips.push({ icon: ClockIcon,    label: post.time });
  const remaining = getRemainingLabel(post);
  if (remaining)      chips.push({ icon: BoltIcon,     label: remaining });
  return chips;
};

/* ── component ── */
// `onReport` hands the post up to whichever list is rendering the card — the
// report dialog is owned there, not here, so only one can ever be open and it
// isn't trapped inside this card's transform (fixed positioning breaks under
// an ancestor transform).
const PostItems = ({ post, onClick, onReport, onEdit }) => {
  const [imageSrc, setImageSrc] = useState(post?.imageUrl || "/placeholder-post.svg");
  const [reported, setReported] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Live distance from the viewer's location to this post, falling back to the
  // post's stored distance string when we can't compute one (no coords yet).
  const { coords } = useCurrentLocation();
  const distanceText = distanceLabel(coords, post) || post?.distance;

  useEffect(() => { setImageSrc(post?.imageUrl || "/placeholder-post.svg"); }, [post?.imageUrl]);

  // localStorage-backed, so this has to run after mount to stay hydration-safe.
  useEffect(() => {
    const sync = () => setReported(hasReportedPost(post?.id, getStoredSession()?.email));

    sync();
    window.addEventListener(REPORTS_CHANGE_EVENT, sync);
    return () => window.removeEventListener(REPORTS_CHANGE_EVENT, sync);
  }, [post?.id]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const updateMenuPosition = () => {
      if (!menuButtonRef.current) return;

      const rect = menuButtonRef.current.getBoundingClientRect();
      const menuWidth = 156;
      const gap = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = rect.right + gap;
      if (left + menuWidth > viewportWidth - 12) {
        left = Math.max(12, viewportWidth - menuWidth - 12);
      }

      let top = rect.top;
      if (top + 120 > viewportHeight - 12) {
        top = Math.max(12, viewportHeight - 120 - 12);
      }

      setMenuPosition({ top, left });
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [menuOpen]);

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
  };

  const themeClass   = getCategoryThemeClass(post?.category);
  const CategoryIcon = SUBCATEGORY_ICONS[post?.subCategory] || DEFAULT_CATEGORY_ICON;
  const primaryLabel = getPrimaryLabel(post?.category);
  const PrimaryIcon  = getPrimaryIcon(post?.category);
  const chips        = getChips(post);
  const authorUsername = getUsernameForPost(post);
  const isOwnPost = post?.email?.toLowerCase() === dummyUser.email.toLowerCase();

  // avatar + name, shared between the linked and plain (unknown author) cases.
  const authorInner = (
    <>
      <span className="relative shrink-0">
        <Image
          src={post?.userImage || "/avatar-placeholder.svg"}
          width={40} height={40}
          unoptimized={post?.userImage?.startsWith("data:")}
          alt={post?.userName || "User"}
          className="h-[34px] w-[34px] rounded-full border border-[var(--border-subtle)] object-cover lg:h-[40px] lg:w-[40px]"
        />
        {post?.isVerified && (
          <CheckBadgeIcon className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-[var(--brand)] drop-shadow-[0_0_2px_var(--bg-card)]" />
        )}
      </span>
      <span className="truncate text-[12.5px] font-semibold text-[var(--text-body)] lg:text-[13.5px]">{post?.userName}</span>
    </>
  );

  return (
    <m.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={tweenFast}
      className={`group relative flex flex-col h-full w-full bg-[var(--bg-card)] rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md overflow-hidden border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(28,32,18,0.06)] lg:hover:shadow-[0_10px_32px_rgba(28,32,18,0.11)] lg:hover:-translate-y-1 active:scale-[0.98] lg:active:scale-100 transition-[transform,box-shadow] duration-200 cursor-pointer select-none transform-gpu will-change-transform ${themeClass}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ── Image ── */}
      <div className="relative h-[150px] w-full overflow-hidden lg:h-[210px]">
        <img
          src={imageSrc}
          alt={post?.title || "post"}
          onError={() => setImageSrc("/placeholder-post.svg")}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] transform-gpu will-change-transform"
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(20,24,14,0.18)] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-card)]/20 to-transparent pointer-events-none" />

        {/* category pill — top left */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[var(--bg-card)]/95 px-2.5 py-1 text-[10.5px] font-semibold text-[var(--text-heading)] shadow-sm backdrop-blur-sm lg:left-3 lg:top-3 lg:text-[11px]">
          <CategoryIcon className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" strokeWidth={2.25} />
          {post?.subCategory || post?.category}
        </span>

        {/* 3-dot menu — top right */}
        <div className="absolute right-2.5 top-2.5 lg:right-3 lg:top-3">
          {/* ── 3-dot dropdown ── */}
          <div ref={menuRef} className="relative">
            <m.button
              ref={menuButtonRef}
              whileHover={hoverScaleIcon}
              whileTap={tapScaleSmall}
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              aria-label="More options"
              className="flex h-8 w-8 items-center justify-center transition"
            >
              <EllipsisVerticalIcon className="h-[15px] w-[15px] text-[var(--text-muted)]" strokeWidth={2.2} />
            </m.button>
          </div>
        </div>

        {/* distance — bottom right */}
        {distanceText && (
          <span className="absolute bottom-2 right-2.5 inline-flex items-center gap-1 rounded-full bg-[var(--text-heading)]/45 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--bg-card)] backdrop-blur-sm lg:bottom-2.5 lg:right-3">
            <MapPinOutlineIcon className="h-3 w-3 shrink-0" strokeWidth={2.25} />
            {distanceText}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5 lg:px-4 lg:pb-4 lg:pt-3">

        {/* title */}
        <h2 className="line-clamp-2 text-[14px] font-bold leading-snug text-[var(--text-heading)] lg:text-[15px]">
          {post?.title}
        </h2>

        {/* location */}
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] lg:mt-1.5 lg:text-[12px]">
          <MapPinIcon className="shrink-0 h-3 w-3 text-[var(--brand)]" />
          <span className="truncate">{post?.location || "Location not set"}</span>
        </div>

        {/* divider */}
        <div className="my-2 h-px bg-[var(--border-subtle)] lg:my-2.5" />

        {/* chips */}
        {chips.length > 0 && (
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 lg:mb-3">
            {chips.map(({ icon: Icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--text-body)] lg:px-2.5 lg:text-[11px]">
                <Icon className="h-[11px] w-[11px] text-[var(--text-faint)]" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* footer: who posted (left) + CTA right */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {authorUsername ? (
            <Link
              href={`/profile/${authorUsername}`}
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-0 items-center gap-2 hover:underline"
            >
              {authorInner}
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-2">{authorInner}</div>
          )}

          <Button
             variant="yellow"
             size="sm"
             onClick={(e) => { e.stopPropagation(); onClick?.(); }}
             className="h-11 shrink-0 gap-1.5 px-4 text-[12.5px] lg:h-10"
           >
            <PrimaryIcon className="h-[13px] w-[13px]" />
            {primaryLabel}
          </Button>
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {menuOpen && menuPosition && (
            <m.div
              initial={{ opacity: 0, scale: 0.92, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: -6 }}
              transition={{ duration: 0.13 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed z-[120] min-w-[140px] overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_12px_32px_rgba(28,32,18,0.2)]"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              {isOwnPost && onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(post);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12.5px] font-semibold text-[var(--text-body)] transition hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
                >
                  <PencilSquareIcon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" strokeWidth={2} />
                  Edit post
                </button>
              )}
              {!isOwnPost && onReport && (
                <button
                  type="button"
                  disabled={reported}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    if (!reported) onReport(post);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12.5px] font-semibold transition ${
                    reported
                      ? "cursor-default text-[var(--danger)]/50"
                      : "text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                  }`}
                >
                  {reported
                    ? <FlagIcon className="h-4 w-4 shrink-0" />
                    : <FlagOutlineIcon className="h-4 w-4 shrink-0" strokeWidth={2} />}
                  {reported ? "Reported" : "Report"}
                </button>
              )}
            </m.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </m.div>
  );
};

export default PostItems;
