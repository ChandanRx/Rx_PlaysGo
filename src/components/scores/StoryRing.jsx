"use client";

const sportColors = { Cricket: "#F98A1F", Football: "#4EA8FF", Badminton: "#F4586A", Tennis: "#22C55E" };

const StoryRing = ({ story, onClick }) => (
  <button type="button" onClick={onClick} className="group flex w-[74px] shrink-0 flex-col items-center gap-1.5 text-center outline-none">
    <span className="relative block rounded-full p-[3px] transition-transform duration-200 group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[var(--brand)]" style={{ background: `linear-gradient(135deg, ${sportColors[story.sport] || "#FE9272"}, #FE9272)` }}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[var(--bg-card)] bg-[var(--bg-secondary)] text-lg font-black text-[var(--text-heading)]">
        {story.username.slice(0, 1).toUpperCase()}
      </span>
      {story.unseen && <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[var(--bg-card)] bg-[var(--brand)]" aria-label="New story" />}
    </span>
    <span className="w-full truncate text-[11px] font-bold text-[var(--text-body)]">{story.username}</span>
    <span className="-mt-1 text-[10px] text-[var(--text-muted)]">{story.timeAgo}</span>
  </button>
);

export default StoryRing;
