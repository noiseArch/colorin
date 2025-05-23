"use client";
import ContrastGrid from "@/components/ContrastGrid";
import TailwindModal from "@/components/TailwindModal";
import { getColorPaletteFamily } from "@/utils/fns";
import { generateSVG } from "@/utils/fns";
import { TScale } from "@/utils/types";
import chroma from "chroma-js";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { generateNewColor, setColorName } from "@/utils/redux/colorSlice";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { LoaderCircle } from "lucide-react";

type Props = {};

export default function ScalePage({}: Props) {
  const searchParams = useSearchParams();
  const paramsHex = searchParams.get("hex");

  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.colorSlice.color);
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  const [isTWModalOpen, setTWModalOpen] = useState<boolean>(false);
  const [isContrastOpen, setContrastOpen] = useState<boolean>(false);
  const [loadingScale, setLoadingScale] = useState<boolean>(true);
  const [scale, setScale] = useState<TScale[] | undefined>(undefined);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    setLoadingScale(true);
    const fetchColor = async () => {
      try {
        if (!color) return toast.error("Color is undefined");
        if (!color.name) {
          const res = await fetch(
            `https://api.color.pizza/v1/?values=${color.hex}`
          );
          const resJson = await res.json();
          dispatch(setColorName({ name: resJson.paletteTitle }));
        }
        const newScale = getColorPaletteFamily("#" + color.hex);
        if (!newScale) throw new Error("Failed to generate color palette");

        setScale(
          newScale.palettes.map((v) => ({ hex: v.hexcode, step: v.number }))
        );
        setLoadingScale(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (!color) {
      dispatch(generateNewColor(paramsHex ? { hex: paramsHex } : undefined));
    } else {
      timeoutId = setTimeout(() => {
        fetchColor();
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [color, dispatch, paramsHex]);

  const mainClassName = useMemo(() => {
    return darkMode
      ? "lg:h-full overflow-x-hidden bg-zinc-900 text-white w-full flex lg:flex-row flex-col justify-between gap-12 px-6 md:px-12 transition"
      : "lg:h-full overflow-x-hidden bg-white text-slate-900 w-full flex lg:flex-row flex-col justify-between gap-12 px-6 md:px-12 transition";
  }, [darkMode]);

  const handleSVGGeneration = useCallback(() => {
    if (!scale) return toast.error("Scale is undefined");
    generateSVG(scale.map((c) => c.hex));
    toast.success("SVG copied to clipboard!");
  }, [scale]);

  return (
    <main className={mainClassName}>
      {isTWModalOpen && color && scale && (
        <TailwindModal
          colorName={color.name || ""}
          color={color ? "#" + color.hex : ""}
          isModalOpen
          setModalOpen={setTWModalOpen}
        />
      )}
      {isContrastOpen && color && scale && (
        <ContrastGrid
          colorName={color.name || ""}
          color={color ? "#" + color.hex : ""}
          isModalOpen
          scale={scale}
          setModalOpen={setContrastOpen}
        />
      )}
      <div className="w-full lg:sticky lg:top-0 lg:w-1/3 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl w-full">Color Scale</h2>
          <div className="flex gap-4 w-full justify-end">
            <button
              disabled={loadingScale || !scale}
              onClick={() => setContrastOpen(true)}
              className="flex items-center gap-1 group relative"
            >
              <span
                className={
                  darkMode
                    ? "group-hover:opacity-100 opacity-0 absolute text-nowrap -translate-x-1/2 left-1/2 top-10 border border-zinc-500 bg-zinc-700 shadow-xl p-1 rounded text-sm transition"
                    : "group-hover:opacity-100 opacity-0 absolute text-nowrap -translate-x-1/2 left-1/2 top-10 border border-gray-300 bg-white shadow-xl p-1 rounded text-sm transition"
                }
              >
                WCAG/APCA Grid
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-grid-3x3"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5zM1.5 1a.5.5 0 0 0-.5.5V5h4V1zM5 6H1v4h4zm1 4h4V6H6zm-1 1H1v3.5a.5.5 0 0 0 .5.5H5zm1 0v4h4v-4zm5 0v4h3.5a.5.5 0 0 0 .5-.5V11zm0-1h4V6h-4zm0-5h4V1.5a.5.5 0 0 0-.5-.5H11zm-1 0V1H6v4z" />
              </svg>
            </button>
            <button
              disabled={loadingScale || !scale}
              onClick={handleSVGGeneration}
              className="lg:flex items-center gap-1 group relative hidden"
            >
              <span
                className={
                  darkMode
                    ? "group-hover:opacity-100 opacity-0 absolute text-nowrap -translate-x-1/2 left-1/2 top-10 border border-zinc-500 bg-zinc-700 shadow-xl p-1 rounded text-sm transition"
                    : "group-hover:opacity-100 opacity-0 absolute text-nowrap -translate-x-1/2 left-1/2 top-10 border border-gray-300 bg-white shadow-xl p-1 rounded text-sm transition"
                }
              >
                Copy SVG
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-filetype-svg"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM0 14.841a1.13 1.13 0 0 0 .401.823q.194.162.478.252.285.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.187-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.776.15-.337.149-.528.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.256.193q-.167.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917zm5.483-3.293q.114.228.14.492h-.776a.8.8 0 0 0-.096-.249.7.7 0 0 0-.17-.19.7.7 0 0 0-.237-.126 1 1 0 0 0-.3-.044q-.427 0-.664.302-.235.3-.235.85v.497q0 .352.097.616a.9.9 0 0 0 .305.413.87.87 0 0 0 .518.146 1 1 0 0 0 .457-.097.67.67 0 0 0 .273-.263q.09-.164.09-.364v-.254h-.823v-.59h1.576v.798q0 .29-.096.55a1.3 1.3 0 0 1-.293.457 1.4 1.4 0 0 1-.495.314q-.296.111-.698.111a2 2 0 0 1-.752-.132 1.45 1.45 0 0 1-.534-.377 1.6 1.6 0 0 1-.319-.58 2.5 2.5 0 0 1-.105-.745v-.507q0-.54.199-.949.202-.406.583-.633.383-.228.926-.228.357 0 .635.1.282.1.48.275.2.176.314.407"
                />
              </svg>
            </button>
            <button
              disabled={loadingScale || !scale}
              onClick={() => setTWModalOpen(true)}
              className="flex items-center gap-1 group relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-box-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"
                />
              </svg>
              <span
                className={
                  darkMode
                    ? "group-hover:opacity-100 opacity-0 text-nowrap absolute -translate-x-1/2 left-1/2 top-10 border border-zinc-500 bg-zinc-700 shadow-xl p-1 rounded text-sm transition"
                    : "group-hover:opacity-100 opacity-0 text-nowrap absolute -translate-x-1/2 left-1/2 top-10 border border-gray-300 bg-white shadow-xl p-1 rounded text-sm transition"
                }
              >
                Export to Code
              </span>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 lg:gap-1 2xl:gap-2">
          {!scale || loadingScale
            ? Array(11)
                .fill(0)
                .map((c, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor:
                        loadingScale && color ? "#" + color.hex : "gray",
                      color: loadingScale && color ? "#" + color.hex : "gray",
                    }}
                    className="w-full h-14 text-sm rounded-xl flex flex-col items-center justify-center animate-pulse"
                  />
                ))
            : scale.map((c, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: c.hex,
                    color:
                      c.hex !== "" && chroma.contrast(c.hex, "white") > 2
                        ? scale[1]?.hex
                        : scale[8]?.hex,
                  }}
                  className="w-full h-14 text-sm rounded-xl flex flex-col items-center justify-center"
                >
                  <span
                    className={
                      color && c.hex === "#" + color.hex ? "font-black" : ""
                    }
                  >
                    {c.hex}
                  </span>
                  <span
                    className={
                      color && c.hex === "#" + color.hex ? "font-black" : ""
                    }
                  >
                    {c.step}
                  </span>
                </div>
              ))}
        </div>
      </div>

      {loadingScale || !scale || !color ? (
        <div className="w-2/3 h-full flex items-center justify-center">
          <LoaderCircle
            width={40}
            color={color ? "#" + color.hex : "black"}
            height={40}
            className="animate-spin"
          />
        </div>
      ) : (
        <div className="h-full w-full lg:w-2/3 flex flex-col gap-4">
          <h2 className="font-medium text-3xl w-full text-center lg:text-left">
            {color.name}
          </h2>
          <div className="flex xl:flex-row flex-col gap-4 xl:h-1/2 w-full">
            <div
              style={{
                backgroundColor: scale[6].hex,
                borderColor: scale[6].hex,
              }}
              className="border p-4 w-full xl:w-1/3 h-1/2 rounded-xl   flex flex-col"
            >
              <span style={{ color: scale[2].hex }}>Views</span>
              <div className="h-full flex flex-col justify-center">
                <span
                  className="font-medium text-6xl"
                  style={{ color: scale[3].hex }}
                >
                  2.789
                </span>
                <span className="text-lg" style={{ color: scale[4].hex }}>
                  More views than last month
                </span>
              </div>
            </div>
            <Calendar
              mode="single"
              styles={{
                root: {
                  borderColor: scale[6].hex,
                  backgroundColor: scale[6].hex,
                },
                head_cell: { color: scale[3].hex },
                cell: { color: scale[1].hex },
                month: { color: scale[1].hex },
              }}
              modifiersStyles={{
                today: { backgroundColor: scale[3].hex, color: scale[7].hex },
                outside: { color: scale[5].hex },
              }}
              className="rounded-xl border h-fit w-fit"
            />
            <div
              style={{ backgroundColor: scale[6].hex }}
              className="gap-4 p-4 w-full xl:w-1/3 h-full rounded-xl flex flex-col"
            >
              <div className="flex flex-col gap-2 h-full">
                <span style={{ color: scale[2].hex }} className="font-medium">
                  Today
                </span>
                <div className="flex flex-col gap-2">
                  <div
                    style={{
                      backgroundColor: scale[2].hex,
                      borderColor: scale[4].hex,
                    }}
                    className="lg:h-1/2 flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[7].hex }}
                    >
                      Event 1
                    </span>
                    <span className="text-sm" style={{ color: scale[6].hex }}>
                      9 AM - 10 AM
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: scale[2].hex,
                      borderColor: scale[4].hex,
                    }}
                    className="lg:h-1/2 flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[7].hex }}
                    >
                      Event 2
                    </span>
                    <span className="text-sm" style={{ color: scale[6].hex }}>
                      11 AM - 2 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 h-full">
                <span style={{ color: scale[2].hex }} className="font-medium">
                  Tomorrow
                </span>
                <div className="flex flex-col gap-2 h-full">
                  <div
                    style={{
                      backgroundColor: scale[2].hex,
                      borderColor: scale[4].hex,
                    }}
                    className="flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[7].hex }}
                    >
                      Event 3
                    </span>
                    <span className="text-sm" style={{ color: scale[6].hex }}>
                      9 AM - 11 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex xl:flex-row flex-col gap-4 xl:h-1/2 w-full">
            <div
              style={{
                backgroundColor: scale[2].hex,
                borderColor: scale[7].hex,
              }}
              className="border p-4 w-full xl:w-1/3 h-1/2 rounded-xl flex flex-col"
            >
              <span style={{ color: scale[7].hex }}>Views</span>
              <div className="h-full flex flex-col justify-center">
                <span
                  className="font-medium text-6xl"
                  style={{ color: scale[6].hex }}
                >
                  2.789
                </span>
                <span className="text-lg" style={{ color: scale[7].hex }}>
                  More views than last month
                </span>
              </div>
            </div>
            <Calendar
              mode="single"
              styles={{
                root: {
                  borderColor: scale[7].hex,
                  backgroundColor: scale[2].hex,
                },
                head_cell: { color: scale[6].hex },
                cell: { color: scale[8].hex },
                month: { color: scale[8].hex },
              }}
              modifiersStyles={{
                today: { backgroundColor: scale[6].hex, color: scale[2].hex },
                outside: { color: scale[5].hex },
              }}
              className="rounded-xl border h-fit w-fit"
            />
            <div
              style={{
                backgroundColor: scale[2].hex,
                borderColor: scale[7].hex,
              }}
              className="gap-4 p-4 border w-full xl:w-1/3 rounded-xl flex flex-col"
            >
              <div className="flex flex-col gap-2 h-full">
                <span style={{ color: scale[8].hex }} className="font-medium">
                  Today
                </span>
                <div className="flex flex-col gap-2">
                  <div
                    style={{
                      backgroundColor: scale[6].hex,
                      borderColor: scale[9].hex,
                    }}
                    className="lg:h-1/2 flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[1].hex }}
                    >
                      Event 1
                    </span>
                    <span className="text-sm" style={{ color: scale[3].hex }}>
                      9 AM - 10 AM
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: scale[6].hex,
                      borderColor: scale[9].hex,
                    }}
                    className="lg:h-1/2 flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[1].hex }}
                    >
                      Event 2
                    </span>
                    <span className="text-sm" style={{ color: scale[3].hex }}>
                      11 AM - 2 PM
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 h-full">
                <span style={{ color: scale[8].hex }} className="font-medium">
                  Tomorrow
                </span>
                <div className="flex flex-col gap-2 h-full">
                  <div
                    style={{
                      backgroundColor: scale[6].hex,
                      borderColor: scale[9].hex,
                    }}
                    className="flex flex-col justify-center rounded-lg border-l-8 p-2"
                  >
                    <span
                      className="font-medium text-lg"
                      style={{ color: scale[1].hex }}
                    >
                      Event 3
                    </span>
                    <span className="text-sm" style={{ color: scale[3].hex }}>
                      9 AM - 11 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
