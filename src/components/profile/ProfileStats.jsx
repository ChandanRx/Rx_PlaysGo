import React from "react";
import Card from "../ui/Card";

const ProfileStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {stats.map(({ label, value, icon: Icon, hint }) => (
      <Card
        key={label}
        className={`p-3.5 sm:p-4 ${hint ? "opacity-60" : ""}`}
        hover={false}
        padding={false}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-[11px] sm:tracking-[0.15em]">
            {label}
          </p>
          <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--brand)] sm:h-5 sm:w-5" strokeWidth={2} />
        </div>
        <p className="mt-2 text-[24px] font-black leading-none text-[var(--text-heading)] sm:text-[28px]">
          {value}
        </p>
      </Card>
    ))}
  </div>
);

export default ProfileStats;
