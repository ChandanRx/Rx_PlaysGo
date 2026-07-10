"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { popIn } from "../../shared/motionPresets";

const defaultGetOptionLabel = (option) =>
  typeof option === "string" ? option : option?.name || "";

const defaultGetOptionValue = (option) =>
  typeof option === "string" ? option : (option?.value ?? option?.name ?? "");

const Dropdown = ({
  label,
  placeholder = "Select…",
  variant = "nav",
  options,
  value,
  onChange,
  active = false,
  getOptionLabel = defaultGetOptionLabel,
  getOptionValue = defaultGetOptionValue,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  optionClassName = "",
}) => {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const isField = variant === "field";

  const selectedIndex = useMemo(
    () =>
      Math.max(
        options.findIndex((option) => getOptionValue(option) === value),
        0,
      ),
    [getOptionValue, options, value],
  );

  const selectedOption = options.find((option) => getOptionValue(option) === value);
  const triggerLabel = isField
    ? (selectedOption ? getOptionLabel(selectedOption) : placeholder)
    : label;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex);
    }
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextOption = optionRefs.current[highlightedIndex];
    if (nextOption) {
      nextOption.scrollIntoView({ block: "nearest" });
      nextOption.focus();
    }
  }, [highlightedIndex, isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const openMenuAt = (index) => {
    setIsOpen(true);
    setHighlightedIndex(index);
  };

  const selectOption = (option) => {
    onChange(option);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenuAt(selectedIndex);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenuAt(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenuAt(selectedIndex);
    }
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => (current + 1) % options.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current === 0 ? options.length - 1 : current - 1,
      );
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlightedIndex(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setHighlightedIndex(options.length - 1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(options[highlightedIndex]);
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() =>
          setIsOpen((current) => {
            const nextState = !current;
            if (nextState) {
              setHighlightedIndex(selectedIndex);
            }
            return nextState;
          })
        }
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={
          isField
            ? `flex w-full items-center justify-between gap-2 rounded-xl border-0 bg-[var(--bg-secondary)] px-3.5 py-2.5 text-left text-[13.5px] transition focus:bg-[var(--bg-card)] focus:shadow-[0_0_0_2px_var(--brand)] disabled:cursor-not-allowed disabled:opacity-50 ${
                selectedOption ? "text-[var(--text-heading)]" : "text-[var(--text-faint)]"
              } ${buttonClassName}`
            : `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--brand)] text-[var(--on-brand)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
              } ${buttonClassName}`
        }
      >
        {triggerLabel}
        <ChevronDownIcon
          className={`h-[18px] w-[18px] shrink-0 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
        <m.div
          {...popIn}
          className={`absolute left-0 z-50 mt-2 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 text-[var(--text-heading)] shadow-[0_12px_32px_rgba(28,32,18,0.14)] ${
            isField ? "right-0 w-full" : "w-64"
          } ${menuClassName}`}
        >
          <div
            role="listbox"
            aria-label={label || placeholder}
            tabIndex={-1}
            onKeyDown={handleMenuKeyDown}
            className="max-h-72 overflow-y-auto"
          >
            {options.map((option, index) => {
              const optionLabel = getOptionLabel(option);
              const optionValue = getOptionValue(option);
              const isSelected = optionValue === value;
              const isHighlighted = highlightedIndex === index;

              return (
                <button
                  key={optionValue}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${
                      isHighlighted || isSelected
                        ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
                    } ${optionClassName}`}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
