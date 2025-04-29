import { generateVariables } from "@/utils/fns";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import CodeBlock from "./Codeblock";

type Props = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  color: string;
  colorName: string;
};

type TCode = {
  tw: { hex: string; oklch: string; hsl: string; rgb: string };
  scss: { hex: string; oklch: string; hsl: string; rgb: string };
  css: { hex: string; oklch: string; hsl: string; rgb: string };
};

export default function TailwindModal({
  setModalOpen,
  isModalOpen,
  color,
  colorName,
}: Props) {
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );
  const [framework, setFramework] = useState<"tw" | "scss" | "css" | "css">(
    "tw"
  );
  const [formatMode, setFormatMode] = useState<"hsl" | "oklch" | "hex" | "rgb">(
    "hex"
  );
  const [code, setCode] = useState<TCode>({
    tw: { hex: "", oklch: "", hsl: "", rgb: "" },
    scss: { hex: "", oklch: "", hsl: "", rgb: "" },
    css: { hex: "", oklch: "", hsl: "", rgb: "" },
  });
  useEffect(() => {
    if (isModalOpen) {
      if (typeof window != "undefined" && window.document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  useEffect(() => {
    const getCodes = async () => {
      setCode(await generateVariables(color, colorName));
    };
    getCodes();
  }, [color, colorName]);

  return (
    <div className="absolute flex z-[998] top-0 left-0 h-screen w-screen overflow-hidden">
      <div className="bg-black bg-opacity-40 p-8 w-full flex items-start justify-center overflow-y-scroll">
        <div
          className={
            darkMode
              ? "bg-zinc-900 overflow-hidden z-[999] rounded-xl p-8 gap-8 flex flex-col"
              : "bg-white overflow-hidden z-[999] rounded-xl p-8 gap-8 flex flex-col"
          }>
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-2xl">Export to TailwindCSS</h2>
            <button onClick={() => setModalOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex gap-8">
            <div className="flex gap-4 items-center flex-wrap">
              <span>Framework:</span>
              <button
                disabled={framework == "tw"}
                onClick={() => setFramework("tw")}
                style={{
                  borderColor: framework == "tw" ? color : "gray",
                  color: framework == "tw" ? color : "gray",
                }}
                className="py-1 px-3 border-2 border-gray-500 rounded transition">
                TailwindCSS
              </button>
              <button
                disabled={framework == "scss"}
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                style={{
                  borderColor: framework == "scss" ? color : "gray",
                  color: framework == "scss" ? color : "gray",
                }}
                onClick={() => setFramework("scss")}>
                SCSS
              </button>
              <button
                disabled={framework == "css"}
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                style={{
                  borderColor: framework == "css" ? color : "gray",
                  color: framework == "css" ? color : "gray",
                }}
                onClick={() => setFramework("css")}>
                CSS
              </button>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <span>Format:</span>
              <button
                disabled={formatMode == "hex"}
                onClick={() => setFormatMode("hex")}
                style={{
                  borderColor: formatMode == "hex" ? color : "gray",
                  color: formatMode == "hex" ? color : "gray",
                }}
                className="py-1 px-3 border-2 border-gray-500 rounded transition">
                HEX
              </button>
              <button
                disabled={formatMode == "oklch"}
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                style={{
                  borderColor: formatMode == "oklch" ? color : "gray",
                  color: formatMode == "oklch" ? color : "gray",
                }}
                onClick={() => setFormatMode("oklch")}>
                OKLCH
              </button>
              <button
                disabled={formatMode == "hsl"}
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                style={{
                  borderColor: formatMode == "hsl" ? color : "gray",
                  color: formatMode == "hsl" ? color : "gray",
                }}
                onClick={() => setFormatMode("hsl")}>
                HSL
              </button>
              <button
                disabled={formatMode == "rgb"}
                className="py-1 px-3 border-2 border-gray-500 rounded transition"
                style={{
                  borderColor: formatMode == "rgb" ? color : "gray",
                  color: formatMode == "rgb" ? color : "gray",
                }}
                onClick={() => setFormatMode("rgb")}>
                RGB
              </button>
            </div>
          </div>
          <CodeBlock
            text={
              formatMode == "hex"
                ? code[framework].hex
                : formatMode == "oklch"
                ? code[framework].oklch
                : formatMode == "rgb"
                ? code[framework].rgb
                : code[framework].hsl
            }
            language={framework == "tw" ? "js" : "css"}
          />
        </div>
      </div>
    </div>
  );
}
