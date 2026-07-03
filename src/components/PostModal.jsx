"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  HiBadgeCheck, HiClock, HiHeart, HiLocationMarker, HiOutlineCalendar,
  HiOutlineChatAlt2, HiOutlineHeart, HiOutlinePhone, HiOutlineShare, HiUsers,
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import Button from "./ui/Button";

const getMetaText = (post) => {
  if (!post?.requiredPeople) return null;
  if (post.category === "For Sale")   return `₹ ${post.requiredPeople}`;
  if (post.category === "Local Help") return `${post.requiredPeople} helpers`;
  return `${post.requiredPeople} players`;
};

const getAccent = (category) => {
  if (category === "Local Help") return { text: "var(--secondary)", soft: "var(--secondary-soft)" };
  if (category === "For Sale")   return { text: "var(--accent)",    soft: "var(--accent-soft)" };
  return { text: "var(--brand)", soft: "var(--brand-soft)" };
};

const getChips = (post) => {
  const chips = [];
  if (post?.location) chips.push({ icon: HiLocationMarker, label: post.location });
  if (post?.date)     chips.push({ icon: HiOutlineCalendar, label: post.date });
  if (post?.time)     chips.push({ icon: HiClock, label: post.time });
  const metric = getMetaText(post);
  if (metric)          chips.push({ icon: HiUsers, label: metric });
  return chips.slice(0, 4);
};

const waLink = (phone) => (phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 639px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
};

const sheetVariants = {
  hidden:  { y: "100%" },
  visible: { y: 0, transition: { type: "spring", damping: 30, stiffness: 300 } },
  exit:    { y: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

const dialogVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 26, stiffness: 320 } },
  exit:    { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } },
};

const PostModal = ({ post, onClose }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [shareCopied, setShareCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  const accent       = getAccent(post.category);
  const chips        = getChips(post);
  const whatsappHref = waLink(post.whatsapp);

  const handleChat = () => {
    onClose?.();
    router.push("/messages");
  };

  const handleCall = () => {
    if (post.phone) window.location.href = `tel:${post.phone}`;
  };

  const handleShare = async () => {
    // No standalone post URL exists anymore (modal-only), so share the feed link instead.
    const shareUrl  = typeof window !== "undefined" ? `${window.location.origin}/posts` : "";
    const shareData = { title: post.title, text: post.desc, url: shareUrl };

    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share(shareData); } catch { /* user dismissed */ }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${post.title} — ${shareUrl}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1800);
      } catch { /* clipboard unavailable */ }
    }
  };

  return (
    <>
      {/* backdrop — visual only, the click-catcher below handles closing */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[100] bg-[var(--text-heading)]/40 backdrop-blur-sm"
      />

      <div
        className="fixed inset-0 z-[101] flex items-end justify-center p-3 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-modal-title"
          variants={isMobile ? sheetVariants : dialogVariants}
          initial="hidden" animate="visible" exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-[24px] bg-[var(--bg-card)] shadow-[0_-8px_40px_rgba(30,20,10,0.18)] sm:max-w-lg sm:max-h-[85vh] sm:rounded-sm sm:shadow-[0_20px_60px_rgba(30,20,10,0.18)]"
        >

          {/* drag handle — mobile bottom sheet only */}
          <div className="flex shrink-0 justify-center pb-1 pt-2.5 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-[var(--border-strong)]" />
          </div>

          {/* scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* compact image */}
            <div className="relative h-[140px] w-full shrink-0 sm:h-[160px]">
              <img
                src={post.imageUrl || "/placeholder-post.svg"}
                alt={post.title || "post"}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-card)]/90 shadow-sm backdrop-blur-sm transition hover:bg-[var(--bg-card)]"
              >
                <X className="h-4 w-4 text-[var(--text-heading)]" strokeWidth={2.25} />
              </button>

              {post.distance && (
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[var(--text-heading)]/50 px-2.5 py-1 text-[10px] font-semibold text-[var(--selected-fg)] backdrop-blur-sm">
                  {post.distance}
                </span>
              )}

              <span
                className="absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                style={{ background: accent.soft, color: accent.text }}
              >
                {post.subCategory || post.category || "Other"}
              </span>
            </div>

            <div className="space-y-3 p-4 sm:p-5">

              <h2 id="post-modal-title" className="text-[18px] font-extrabold leading-tight text-[var(--text-heading)] sm:text-[20px]">
                {post.title}
              </h2>

              {chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chips.map(({ icon: Icon, label }, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--text-body)]"
                      style={{ background: accent.soft }}
                    >
                      <Icon style={{ color: accent.text }} className="text-[11px]" />
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {post.desc && (
                <p className="line-clamp-2 text-[12.5px] leading-relaxed text-[var(--text-body)]">
                  {post.desc}
                </p>
              )}

              {/* poster row */}
              <div className="flex items-center gap-2.5 border-t border-[var(--border-subtle)] pt-3">
                <Image
                  src={post.userImage || "/avatar-placeholder.svg"}
                  alt={post.userName || "User"}
                  width={32} height={32}
                  className="h-8 w-8 shrink-0 rounded-full border border-[var(--border-subtle)] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-[12.5px] font-bold text-[var(--text-heading)]">{post.userName}</p>
                    {post.isVerified && <HiBadgeCheck style={{ color: accent.text }} className="shrink-0 text-[12px]" />}
                  </div>
                  <p className="text-[10.5px] text-[var(--text-faint)]">{post.postedTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* sticky footer */}
          <div className="grid shrink-0 grid-cols-3 gap-2 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-[0_-2px_12px_rgba(30,20,10,0.05)] sm:grid-cols-5">
            <Button
              variant="ghost" size="sm" className="min-h-11 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              onClick={handleChat}
            >
              <HiOutlineChatAlt2 className="text-[14px]" /> Chat
            </Button>
            <Button
              variant="secondary" size="sm" className="min-h-11"
              onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
              disabled={!whatsappHref}
            >
              <FaWhatsapp className="text-[14px]" /> WhatsApp
            </Button>
            <Button
              variant="secondary" size="sm" className="min-h-11"
              onClick={handleCall}
              disabled={!post.phone}
            >
              <HiOutlinePhone className="text-[14px]" /> Call
            </Button>
            <Button
              variant="ghost" size="sm"
              className={`min-h-11 border ${saved ? "border-[var(--brand-border)] bg-[var(--brand-soft)]" : "border-[var(--border-subtle)] bg-[var(--bg-secondary)]"}`}
              onClick={() => setSaved((v) => !v)}
            >
              {saved
                ? <HiHeart className="text-[14px] text-[var(--brand)]" />
                : <HiOutlineHeart className="text-[14px]" />}
              Save
            </Button>
            <Button
              variant="ghost" size="sm" className="min-h-11 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              onClick={handleShare}
            >
              <HiOutlineShare className="text-[14px]" /> {shareCopied ? "Copied!" : "Share"}
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PostModal;
