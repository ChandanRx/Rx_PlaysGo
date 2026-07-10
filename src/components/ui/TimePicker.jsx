import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { fieldBaseClass } from "./FormControls";

const TimePicker = ({ className = "", ...props }) => (
  <div className="relative">
    <input
      type="time"
      className={`${fieldBaseClass} pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 ${className}`}
      {...props}
    />
    <ClockIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
  </div>
);

export default TimePicker;
