"use client";

import { ChatBubbleOvalLeftEllipsisIcon, ClockIcon, HandThumbUpIcon, MapPinIcon } from "@heroicons/react/24/outline";

const STATUS = {
  live: { label: "Live", tone: "bg-[#22C55E] text-white", dot: "bg-[#22C55E]" },
  completed: { label: "Completed", tone: "bg-[var(--bg-secondary)] text-[var(--text-muted)]", dot: "bg-[var(--text-faint)]" },
  upcoming: { label: "Upcoming", tone: "bg-[var(--info-soft)] text-[#2776C5]", dot: "bg-[var(--info)]" },
};

const ScoreCard = ({ score, onOpen, onLike }) => {
  const status = STATUS[score.status];
  return (
    <article className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-xs)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-[var(--text-muted)]">{score.sport}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${status.tone}`}>
          <i className={`h-1.5 w-1.5 rounded-full ${status.dot} ${score.status === "live" ? "animate-pulse" : ""}`} /> {status.label}
        </span>
      </div>
      <button type="button" onClick={onOpen} className="mt-4 block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]">
        <div className="space-y-3">
          {[score.teamA, score.teamB].map((team) => (
            <div className="flex items-center justify-between gap-3" key={team.name}>
              <span className="flex min-w-0 items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-xs font-black text-[var(--brand)]">{team.name.slice(0, 1)}</span><span className="truncate text-sm font-bold text-[var(--text-heading)]">{team.name}</span></span>
              <strong className="shrink-0 text-base text-[var(--text-heading)]">{team.score || "–"}</strong>
            </div>
          ))}
        </div>
      </button>
      {score.status === "completed" && (
        <button type="button" onClick={onOpen} className="mt-4 block w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-soft)] px-3 py-2.5 text-left transition hover:brightness-95">
          <span className="block text-[10px] font-black uppercase tracking-[.14em] text-[var(--brand)]">Final result</span>
          <span className="mt-0.5 block text-sm font-black text-[var(--text-heading)]">{score.result || "Match completed"}</span>
        </button>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-light)] pt-3 text-[11px] text-[var(--text-muted)]">
        <span className="flex min-w-0 items-center gap-1 truncate"><ClockIcon className="h-3.5 w-3.5" />{score.matchTime}</span>
        {score.location && <span className="hidden items-center gap-1 truncate sm:flex"><MapPinIcon className="h-3.5 w-3.5" />{score.location}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={onLike} className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${score.liked ? "text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-[var(--brand)]"}`}><HandThumbUpIcon className="h-4 w-4" />{score.likes}</button>
        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]"><ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />{score.comments}</span>
        <button type="button" onClick={onOpen} className="text-xs font-bold text-[var(--brand)] hover:text-[var(--brand-hover)]">View details</button>
      </div>
    </article>
  );
};
export default ScoreCard;
