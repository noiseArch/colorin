import { TGrid, TRow, createAPCAGrid, createWCAGGrid } from "@/utils/fns";
import { TScale } from "@/utils/types";
import React, { SetStateAction, Dispatch, useState } from "react";
import { useSelector } from "react-redux";
import ContrastTable from "./ContrastTable";
import { X } from "lucide-react";

type Props = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  color: string;
  scale: TScale[];
  colorName: string;
};

export default function ContrastGrid({
  setModalOpen,
  isModalOpen,
  color,
  scale,
  colorName,
}: Props) {
  const [mode, setMode] = useState<"wcag" | "apca">("wcag");
  const [score, setScore] = useState<"all" | "aa" | "aaa">("all");

  const wcagGrid = createWCAGGrid(scale);
  const apcaGrid = createAPCAGrid(scale);
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );
  return (
    <div className="absolute flex z-[998] top-0 left-0 h-screen w-screen overflow-hidden">
      <div className="bg-black bg-opacity-40 p-8 w-full flex items-start justify-start lg:justify-center overflow-y-scroll">
        <div
          className={
            darkMode
              ? "h-fit w-fit bg-zinc-900 rounded-xl p-6 gap-4 flex flex-col"
              : "h-fit w-fit bg-white rounded-xl p-6 gap-4 flex flex-col"
          }>
          <div className="flex w-full justify-between items-center">
            <h2 className="font-mediun text-2xl">
              Contrast Grid - {colorName}
            </h2>
            <button onClick={() => setModalOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex gap-4 items-center">
              <span>Mode:</span>
              <button
                disabled={mode == "wcag"}
                onClick={() => setMode("wcag")}
                style={{
                  borderColor: mode == "wcag" ? color : "gray",
                  color: mode == "wcag" ? color : "gray",
                }}
                className="py-1 px-3 border-2 border-gray-500 rounded transition">
                WCAG
              </button>
              <button
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                disabled={mode == "apca"}
                style={{
                  borderColor: mode == "apca" ? color : "gray",
                  color: mode == "apca" ? color : "gray",
                }}
                onClick={() => setMode("apca")}>
                APCA
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <span>Score:</span>
              <button
                disabled={score == "all"}
                onClick={() => setScore("all")}
                style={{
                  borderColor: score == "all" ? color : "gray",
                  color: score == "all" ? color : "gray",
                }}
                className="py-1 px-3 border-2 border-gray-500 rounded transition">
                All
              </button>
              <button
                disabled={score == "aa"}
                onClick={() => setScore("aa")}
                style={{
                  borderColor: score == "aa" ? color : "gray",
                  color: score == "aa" ? color : "gray",
                }}
                className="py-1 px-3 border-2 border-gray-500 rounded transition">
                AA - {mode == "wcag" ? "4.5+" : "60%"}
              </button>
              <button
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                disabled={score == "aaa"}
                style={{
                  borderColor: score == "aaa" ? color : "gray",
                  color: score == "aaa" ? color : "gray",
                }}
                onClick={() => setScore("aaa")}>
                AAA - {mode == "wcag" ? "7+" : "80%"}
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full h-full">
            <div className="flex w-full justify-between items-center">
              {["", "White", ...scale.flatMap((s) => s.step), "Black"].map(
                (s: any, i) => (
                  <span
                    key={i}
                    className="font-medium aspect-square flex items-center w-full justify-center">
                    {s}
                  </span>
                )
              )}
            </div>
            <div className="flex w-full h-full">
              <div className="flex flex-col justify-between items-center">
                {["White", ...scale.flatMap((s) => s.step), "Black"].map(
                  (s: any, i) => (
                    <span
                      key={i}
                      className="font-medium aspect-square flex items-center w-full justify-center">
                      {s}
                    </span>
                  )
                )}
              </div>
              <ContrastTable
                grid={mode == "wcag" ? wcagGrid : apcaGrid}
                score={score}
                mode={mode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
