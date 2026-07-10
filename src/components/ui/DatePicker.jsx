import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { fieldBaseClass } from "./FormControls";

const DatePicker = ({ className = "", ...props }) => (
  <div className="relative">
    <input
      type="date"
      className={`${fieldBaseClass} pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 ${className}`}
      {...props}
    />
    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
  </div>
);

export default DatePicker;
