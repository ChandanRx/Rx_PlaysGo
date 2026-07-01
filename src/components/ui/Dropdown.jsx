"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const defaultGetOptionLabel = (option) =>
  typeof option === "string" ? option : option?.name || "";

const defaultGetOptionValue = (option) =>
  typeof option === "string" ? option : (option?.value ?? option?.name ?? "");

const Dropdown = ({
  label,
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

  const selectedIndex = useMemo(
    () =>
      Math.max(
        options.findIndex((option) => getOptionValue(option) === value),
        0,
      ),
    [getOptionValue, options, value],
  );

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
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
          active
            ? "theme-accent-fill shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
        } ${buttonClassName}`}
      >
        {label}
        <HiChevronDown
          className={`text-[18px] transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`theme-float absolute left-0 mt-3 w-64 overflow-hidden rounded-[20px] p-2 text-zinc-950 ${menuClassName}`}
        >
          <div
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleMenuKeyDown}
            className="quibly-scrollbar max-h-72 overflow-y-auto"
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
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                    isHighlighted || isSelected
                      ? "theme-accent-fill"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  } ${optionClassName}`}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
