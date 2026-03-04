'use client'
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.section
      className="mx-auto max-w-5xl rounded-2xl border border-white/5 bg-black/40 px-6 py-14 text-center text-slate-50 shadow-[0_18px_60px_rgba(0,0,0,0.45)] md:px-12 md:py-16"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <motion.p
        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-emerald-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Play together · Anywhere
      </motion.p>

      <motion.h1
        className="mt-6 text-3xl font-semibold leading-tight md:text-5xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
      >
        A cleaner way to find
        <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-200 bg-clip-text text-transparent">
          games & players near you
        </span>
      </motion.h1>

      <motion.p
        className="mx-auto mt-5 max-w-2xl text-sm text-slate-300 md:mt-6 md:text-base"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Create or join local matches in seconds. Keep it simple, skip the group chats, and get back to what matters —
        actually playing.
      </motion.p>
    </motion.section>
  );
};

export default Hero;
