import { TGrid, TRow } from "@/utils/fns";
import React from "react";

type Props = {
  grid: TGrid;
  score: "all" | "aa" | "aaa";
  mode: "wcag" | "apca";
};

export default function ContrastTable({ grid, score, mode }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {grid.map((row: TRow) => (
        <div className="flex w-full h-full justify-between items-center gap-1">
          {row.map((n) => (
            <span
              style={{ color: n.color1, backgroundColor: n.color2 }}
              className={
                (score == "aaa" && mode == "wcag" && n.contrast < 7) ||
                (score == "aa" && mode == "wcag" && n.contrast < 4.5) ||
                (score == "aaa" &&
                  mode == "apca" &&
                  Math.abs(n.contrast) < 80) ||
                (score == "aa" && mode == "apca" && Math.abs(n.contrast) < 60)
                  ? "invisible w-12 h-12 text-sm flex items-center justify-center rounded"
                  : "w-12 h-12 text-sm flex items-center justify-center rounded"
              }
            >
              {mode == "wcag" ? n.contrast : n.contrast + "%"}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
