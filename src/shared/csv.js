// Client-side CSV export. Builds a CSV string from column defs + rows and
// triggers a browser download via a Blob object URL — no backend involved.

// RFC-4180 field escaping: wrap in quotes when the value contains a comma,
// quote, or newline; double any embedded quotes.
const escapeCell = (value) => {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * @param {string} filename   e.g. "posts.csv"
 * @param {{ header: string, value: (row) => any }[]} columns
 * @param {object[]} rows
 */
export const downloadCsv = (filename, columns, rows) => {
  if (typeof window === "undefined") return;

  const lines = [
    columns.map((c) => escapeCell(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(",")),
  ];
  // Leading BOM so Excel reads UTF-8 (accented names, ₹, …) correctly.
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
