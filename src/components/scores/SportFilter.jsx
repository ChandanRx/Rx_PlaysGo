"use client";

const SportFilter = ({ sports, selected, onChange }) => (
  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
    {sports.map((sport) => {
      const active = sport === selected;
      return (
        <button
          key={sport}
          type="button"
          onClick={() => onChange(sport)}
          className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
            active
              ? "bg-[var(--selected-bg)] text-[var(--selected-fg)] shadow-sm"
              : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)]"
          }`}
        >
          {sport}
        </button>
      );
    })}
  </div>
);

export default SportFilter;
