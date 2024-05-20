import { generateVariables } from "@/utils/fns";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyBlock, atomOneDark } from "react-code-blocks";
import { useSelector } from "react-redux";
import { toast } from "sonner";

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
  }, []);

  return (
    <>
      <div
        onClick={() => setModalOpen(false)}
        className="bg-black opacity-40 w-screen h-screen absolute top-0 left-0 z-[998]"
      />
      <div
        className={
          darkMode
            ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 w-1/2 z-[999] rounded-xl p-8 gap-8 flex flex-col"
            : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-1/2 z-[999] rounded-xl p-8 gap-8 flex flex-col"
        }
      >
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl">Export to TailwindCSS</h2>
          <button onClick={() => setModalOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              className={darkMode ? "fill-white" : "fill-slate-900"}
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
        </div>
        <div className="flex gap-8">
          <div className="flex gap-4 items-center">
            <span>Framework:</span>
            <button
              disabled={framework == "tw"}
              onClick={() => setFramework("tw")}
              style={{
                borderColor: framework == "tw" ? color : "gray",
                color: framework == "tw" ? color : "gray",
              }}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
            >
              TailwindCSS
            </button>
            <button
              disabled={framework == "scss"}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
              style={{
                borderColor: framework == "scss" ? color : "gray",
                color: framework == "scss" ? color : "gray",
              }}
              onClick={() => setFramework("scss")}
            >
              SCSS
            </button>
            <button
              disabled={framework == "css"}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
              style={{
                borderColor: framework == "css" ? color : "gray",
                color: framework == "css" ? color : "gray",
              }}
              onClick={() => setFramework("css")}
            >
              CSS
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <span>Format:</span>
            <button
              disabled={formatMode == "hex"}
              onClick={() => setFormatMode("hex")}
              style={{
                borderColor: formatMode == "hex" ? color : "gray",
                color: formatMode == "hex" ? color : "gray",
              }}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
            >
              HEX
            </button>
            <button
              disabled={formatMode == "oklch"}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
              style={{
                borderColor: formatMode == "oklch" ? color : "gray",
                color: formatMode == "oklch" ? color : "gray",
              }}
              onClick={() => setFormatMode("oklch")}
            >
              OKLCH
            </button>
            <button
              disabled={formatMode == "hsl"}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
              style={{
                borderColor: formatMode == "hsl" ? color : "gray",
                color: formatMode == "hsl" ? color : "gray",
              }}
              onClick={() => setFormatMode("hsl")}
            >
              HSL
            </button>
            <button
              disabled={formatMode == "rgb"}
              className="py-1 px-3 border-2 border-gray-500 rounded transition"
              style={{
                borderColor: formatMode == "rgb" ? color : "gray",
                color: formatMode == "rgb" ? color : "gray",
              }}
              onClick={() => setFormatMode("rgb")}
            >
              RGB
            </button>
          </div>
        </div>
        <CopyBlock
          onCopy={() => toast.success("Code copied to clipboard!")}
          text={
            formatMode == "hex"
              ? code[framework].hex
              : formatMode == "oklch"
              ? code[framework].oklch
              : formatMode == "rgb"
              ? code[framework].rgb
              : code[framework].hsl
          }
          showLineNumbers
          theme={atomOneDark}
          language="js"
        />
      </div>
    </>
  );
}
