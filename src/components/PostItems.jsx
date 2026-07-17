"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  CheckBadgeIcon, ClockIcon, HeartIcon, MapPinIcon, TagIcon, UsersIcon,
} from "@heroicons/react/24/solid";
import {
  CalendarIcon, ChatBubbleLeftRightIcon,
  HeartIcon as HeartOutlineIcon,
  MapPinIcon as MapPinOutlineIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { m } from "framer-motion";
import { DEFAULT_CATEGORY_ICON, SUBCATEGORY_ICONS } from "../shared/lucideIcons";
import { getUsernameForPost } from "../shared/dummyPosts";
import {
  fadeUp, hoverScale, hoverScaleIcon, tapScale, tapScaleSmall, tweenFast,
} from "../shared/motionPresets";

/* ── helpers ── */
const getCategoryThemeClass = (c) => {
  if (c === "Players")    return "category-theme--players";
  if (c === "Local Help") return "category-theme--local-help";
  if (c === "For Sale")   return "category-theme--for-sale";
  return "";
};

const getMetaText = (post) => {
  if (!post?.requiredPeople) return null;
  if (post.category === "For Sale")   return `₹ ${post.requiredPeople}`;
  if (post.category === "Local Help") return `${post.requiredPeople} Helpers`;
  return `${post.requiredPeople} Players`;
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

const getChips = (post) => {
  const chips = [];
  if (post?.subCategory)    chips.push({ icon: TagIcon,            label: post.subCategory });
  if (post?.requiredPeople) chips.push({ icon: UsersIcon,          label: getMetaText(post) });
  if (post?.duration)       chips.push({ icon: ClockIcon,          label: post.duration });
  if (post?.date)           chips.push({ icon: CalendarIcon, label: post.date });
  return chips.slice(0, 3);
};

/* ── component ── */
const PostItems = ({ post, onClick }) => {
  const [imageSrc, setImageSrc] = useState(post?.imageUrl || "/placeholder-post.svg");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setImageSrc(post?.imageUrl || "/placeholder-post.svg"); }, [post?.imageUrl]);

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
  };

  const themeClass   = getCategoryThemeClass(post?.category);
  const CategoryIcon = SUBCATEGORY_ICONS[post?.subCategory] || DEFAULT_CATEGORY_ICON;
  const primaryLabel = getPrimaryLabel(post?.category);
  const PrimaryIcon  = getPrimaryIcon(post?.category);
  const chips        = getChips(post);
  const metaText     = getMetaText(post);
  const authorUsername = getUsernameForPost(post);

  // avatar + name, shared between the linked and plain (unknown author) cases.
  const authorInner = (
    <>
      <span className="relative shrink-0">
        <Image
          src={post?.userImage || "/avatar-placeholder.svg"}
          width={26} height={26}
          unoptimized={post?.userImage?.startsWith("data:")}
          alt={post?.userName || "User"}
          className="h-[22px] w-[22px] rounded-full border border-[var(--border-subtle)] object-cover lg:h-[26px] lg:w-[26px]"
        />
        {post?.isVerified && (
          <CheckBadgeIcon className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 text-[var(--brand)] drop-shadow-[0_0_2px_var(--bg-card)]" />
        )}
      </span>
      <span className="truncate text-[11px] font-semibold text-[var(--text-body)] lg:text-[11.5px]">{post?.userName}</span>
    </>
  );

  return (
    <m.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={tweenFast}
      className={`group flex flex-col h-full w-full bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-[0_2px_12px_rgba(28,32,18,0.06)] lg:hover:shadow-[0_10px_32px_rgba(28,32,18,0.11)] lg:hover:-translate-y-1 active:scale-[0.98] lg:active:scale-100 transition-[transform,box-shadow] duration-200 cursor-pointer select-none transform-gpu will-change-transform ${themeClass}`}
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
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--bg-card)]/20 to-transparent pointer-events-none" />

        {/* category pill — top left */}
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-[var(--bg-card)]/95 px-2.5 py-1 text-[10.5px] font-semibold text-[var(--text-heading)] shadow-sm backdrop-blur-sm lg:left-3 lg:top-3 lg:text-[11px]">
          <CategoryIcon className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" strokeWidth={2.25} />
          {post?.subCategory || post?.category}
        </span>

        {/* save — top right */}
        <m.button
          whileHover={hoverScaleIcon} whileTap={tapScaleSmall}
          onClick={(e) => { e.stopPropagation(); setSaved((v) => !v); }}
          aria-label={saved ? "Unsave" : "Save"}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/95 shadow-sm backdrop-blur-sm transition hover:bg-[var(--bg-card)] lg:right-3 lg:top-3"
        >
          {saved
            ? <HeartIcon className="h-[15px] w-[15px] text-[var(--brand)]" />
            : <HeartOutlineIcon className="h-[15px] w-[15px] text-[var(--text-muted)]" />}
        </m.button>

        {/* distance — bottom right */}
        {post?.distance && (
          <span className="absolute bottom-2 right-2.5 inline-flex items-center gap-1 rounded-full bg-[var(--text-heading)]/45 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--selected-fg)] backdrop-blur-sm lg:bottom-2.5 lg:right-3">
            <MapPinOutlineIcon className="h-3 w-3 shrink-0" strokeWidth={2.25} />
            {post.distance}
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

        {/* user row */}
        <div className="mt-2.5 flex items-center gap-2 lg:mt-3">
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
          <span className="ml-auto shrink-0 text-[10px] text-[var(--text-faint)] lg:text-[10.5px]">{post?.postedTime}</span>
        </div>

        {/* divider */}
        <div className="my-2 h-px bg-[var(--border-subtle)] lg:my-2.5" />

        {/* chips */}
        {chips.length > 0 && (
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 lg:mb-3">
            {chips.map(({ icon: Icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--text-body)] lg:px-2.5 lg:text-[11px]">
                <Icon className="h-[11px] w-[11px] text-[var(--text-faint)]" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* footer: meta left + CTA right */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div>
            {metaText ? (
              <>
                <p className="text-[17px] font-black leading-none text-[var(--text-heading)] lg:text-[18px]">{metaText}</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-faint)] lg:text-[10.5px]">
                  {post?.category === "For Sale" ? "asking price" : "needed"}
                </p>
              </>
            ) : (
              <>
                <p className="text-[13.5px] font-bold leading-none text-[var(--text-heading)] lg:text-[14px]">{post?.category}</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-faint)] lg:text-[10.5px]">post</p>
              </>
            )}
          </div>

          <m.button
             whileHover={hoverScale} whileTap={tapScale}
             onClick={(e) => { e.stopPropagation(); onClick?.(); }}
             className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-hover)] px-4 text-[12.5px] font-bold text-[var(--on-brand)] shadow-[0_4px_14px_rgba(var(--brand-rgb),0.30)] transition-[background-color] hover:bg-[var(--brand-hover)] lg:h-auto lg:bg-none lg:bg-[var(--brand)] lg:py-2 lg:shadow-none"
           >
            <PrimaryIcon className="h-[13px] w-[13px]" />
            {primaryLabel}
          </m.button>
        </div>
      </div>
    </m.div>
  );
};

export default PostItems;
