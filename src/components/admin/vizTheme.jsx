"use client";

import React from "react";
import { HandRaisedIcon, ShoppingBagIcon, TrophyIcon } from "@heroicons/react/24/outline";

/* Chart series colors for the admin dashboard, scoped under `.admin-viz`.
 *
 * Hues are drawn from the app palette (brand lime, --info blue, the for-sale
 * category tint) but lightness-snapped so each mode passes the dataviz checks
 * (OKLCH lightness band, chroma floor, CVD ΔE ≥ 12, ≥ 3:1 contrast) against the
 * actual chart surface (--bg-card: #FAFBF5 light / #1D1D1B dark). Validated
 * with the dataviz skill's validate_palette.js — worst adjacent CVD ΔE ≈ 94
 * light / 108 dark. Color follows the category (fixed assignment), never rank.
 */
export const AdminVizStyles = () => (
  <style>{`
    .admin-viz{
      --viz-players:    #55A214;
      --viz-local-help: #2E7CC3;
      --viz-for-sale:   #A87B24;
      --viz-other:      #6F7562;
    }
    [data-theme="dark"] .admin-viz{
      --viz-players:    #6DA22A;
      --viz-local-help: #3987E5;
      --viz-for-sale:   #D3720F;
      --viz-other:      #93938B;
    }
  `}</style>
);

/* Fixed category → color/icon assignment. Unknown categories fold into the
 * muted "other" slot rather than minting a new hue. */
export const CATEGORY_META = {
  Players: { label: "Players", icon: TrophyIcon, color: "var(--viz-players)" },
  "Local Help": { label: "Local Help", icon: HandRaisedIcon, color: "var(--viz-local-help)" },
  "For Sale": { label: "For Sale", icon: ShoppingBagIcon, color: "var(--viz-for-sale)" },
};

export const categoryColor = (category) =>
  CATEGORY_META[category]?.color || "var(--viz-other)";

/* Post lifecycle states use the app's reserved status tokens (never the
 * categorical slots) and are always paired with a visible label + count. */
export const STATUS_COLORS = {
  Active: "var(--success)",
  Draft: "var(--warning)",
  Closed: "var(--text-faint)",
  Expired: "var(--danger)",
};
