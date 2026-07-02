"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import Card from "../ui/Card";

const MotionCard = motion(Card);

const NEEDS = [
  "players for tonight's match",
  "a maths tutor",
  "help to move this weekend",
  "someone to guide a local task",
  "a nearby item for sale",
];

const QUICK_FILTERS = ["Players", "Local Help", "For Sale"];

// Free to use under the Unsplash License — swap for your own shot anytime.
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1548939201-7aabcd8f9566?fm=jpg&q=80&w=1400&auto=format&fit=crop";

const Hero = () => {
  const [needIndex, setNeedIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setNeedIndex((i) => (i + 1) % NEEDS.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <MotionCard
      as="section"
      className="mx-auto max-w-8xl px-6 py-12 md:px-12 md:py-16"
      style={{
        background: "linear-gradient(180deg, #fbf6f3 0%, #fdf3ee 100%)",
      }}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Copy column */}
        <div className="text-left">
          <motion.p
             className="inline-flex items-center gap-2 rounded-full border border-[var(--hero-brand)]/25 bg-[var(--hero-brand-soft)]/76 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--hero-brand)]"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1, duration: 0.5 }}
           >
             <span className="relative flex h-1.5 w-1.5">
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hero-brand)]/60" />
               <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--hero-brand)]" />
             </span>
             1,400+ posts within 10&nbsp;km right now
           </motion.p>

           <motion.h1
             className="mt-5 text-[2.1rem] font-bold leading-[1.12] tracking-tight text-[var(--text-zinc-950)] md:text-[3.4rem]"
             initial={{ opacity: 0, y: 18 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.22, duration: 0.6 }}
           >
             Find{" "}
             <span className="relative inline-block min-h-[1.2em] align-bottom">
               <AnimatePresence mode="wait">
                 <motion.span
                   key={NEEDS[needIndex]}
                   initial={{ opacity: 0, y: 14 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -14 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   className="inline-block text-[var(--hero-brand)]"
                 >
                   {NEEDS[needIndex]}
                 </motion.span>
               </AnimatePresence>
             </span>
             <br />
             without leaving your neighbourhood.
           </motion.h1>

           <motion.p
             className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--text-zinc-600)] md:text-base"
             initial={{ opacity: 0, y: 16 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.36, duration: 0.6 }}
           >
             Plays Go turns your area into a feed. Post what you need, see
             what&apos;s close by on the map, and message someone directly — over
             chat or WhatsApp.
           </motion.p>

           <motion.div
             className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
             initial={{ opacity: 0, y: 14 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.48, duration: 0.5 }}
           >
             <Link
               href="/createpost"
               className="inline-flex items-center justify-center rounded-sm bg-[var(--hero-brand)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--hero-brand-hover)]"
             >
               Create a post
             </Link>
             <Link
               href="/search"
               className="inline-flex items-center justify-center rounded-sm border border-[var(--hero-brand)]/30 bg-[var(--bg-card)]/88 px-5 py-3 text-sm font-semibold text-[var(--text-zinc-950)] shadow-sm transition hover:border-[var(--hero-brand)]/50 hover:bg-[var(--hero-brand-soft)]"
             >
               Browse nearby
             </Link>
           </motion.div>

           <motion.div
             className="mt-8"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6, duration: 0.6 }}
           >
             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-zinc-400)]">
               Popular nearby
             </p>
             <div className="mt-2.5 flex flex-wrap gap-2">
               {QUICK_FILTERS.map((f) => (
                 <Link
                   key={f}
                   href={`/search?category=${encodeURIComponent(f)}`}
                   className="rounded-full border border-[var(--hero-brand)]/15 bg-[var(--bg-card)]/84 px-3 py-1.5 text-xs font-medium text-[var(--text-zinc-700)] transition hover:border-[var(--hero-brand)]/40 hover:bg-[var(--hero-brand-soft)] hover:text-[var(--hero-brand)]"
                 >
                   {f}
                 </Link>
               ))}
             </div>
           </motion.div>
         </div>

         {/* Photo column */}
         <motion.div
           className="relative mx-auto w-full max-w-md lg:max-w-none"
           initial={{ opacity: 0, scale: 0.94 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
         >
           {/* soft ambient glow */}
           <div
             className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--hero-brand-soft)]/40 blur-3xl"
             aria-hidden
           />

           <div className="relative overflow-hidden rounded-sm shadow-xl">
             <img
               src={HERO_PHOTO}
               alt="A group of friends playing together outdoors at golden hour"
               className="h-[420px] w-full object-cover md:h-[480px]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-heading)]/55 via-transparent to-transparent" />

             <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)]/92 px-3 py-1 text-[11px] font-semibold text-[var(--hero-brand)] shadow-sm backdrop-blur">
               <span className="h-1.5 w-1.5 rounded-full bg-[var(--hero-brand)]" />
               Live near you
             </div>
           </div>

           {/* Floating feed-card preview */}
           <motion.div
             className="absolute -bottom-8 -left-4 w-[230px] -rotate-3 rounded-sm border border-[var(--hero-brand)]/12 bg-[var(--bg-card)] p-3.5 shadow-2xl sm:-left-8 sm:w-[250px]"
             initial={{ opacity: 0, y: 20, rotate: -8 }}
             animate={{ opacity: 1, y: 0, rotate: -3 }}
             transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
           >
             <div className="flex items-center gap-2">
               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--hero-brand)] text-[11px] font-semibold text-white">
                 RK
               </div>
               <div className="min-w-0">
                 <p className="truncate text-xs font-semibold text-[var(--text-zinc-950)]">
                   <span className="inline-flex items-center gap-1">
                     Rohan K.
                     <BadgeCheck className="h-3.5 w-3.5 text-[var(--hero-brand)]" strokeWidth={2.25} />
                   </span>
                 </p>
                 <p className="text-[10px] text-[var(--text-zinc-400)]">1.2 km · 5m ago</p>
               </div>
               <span className="ml-auto shrink-0 rounded-full bg-[var(--hero-brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--hero-brand)]">
                 Players
               </span>
             </div>
             <p className="mt-2.5 text-sm font-semibold text-[var(--text-zinc-950)]">
               Sunday Cricket Match
             </p>
             <div className="mt-1 flex items-center justify-between">
               <p className="text-[11px] text-[var(--text-zinc-500)]">Need 4 players</p>
               <span className="rounded-full bg-[var(--hero-brand)] px-3 py-1 text-[11px] font-semibold text-white">
                 Join
               </span>
             </div>
           </motion.div>
         </motion.div>
      </div>
    </MotionCard>
  );
};

export default Hero;
