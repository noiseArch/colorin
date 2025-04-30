"use client";
import { getColorPaletteFamily } from "@/utils/fns";
import { Color, TScale } from "@/utils/types";
import chroma from "chroma-js";
import React, { useEffect, useMemo, useState } from "react";
import Format from "./Format";
import { TinyColor } from "@ctrl/tinycolor";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { generateNewColor, setColorName } from "@/utils/redux/colorSlice";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {};

export default function Main({}: Props) {
  /* Router hooks */
  const searchParams = useSearchParams();
  /* Redux hooks */
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.colorSlice.color);
  const darkMode = useAppSelector((state) => state.darkMode.boolean);
  /* States */
  const [inputColor, setInputColor] = useState("#");
  const [loadingScale, setLoadingScale] = useState<boolean>(true);
  const [colorInfo, setColorInfo] = useState<{
    darkenHex: string | undefined;
    lightenHex: string | undefined;
  }>({
    darkenHex: undefined,
    lightenHex: undefined,
  });

  const paramsHex = searchParams.get("hex");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    setLoadingScale(true);
    const fetchColor = async () => {
      try {
        if(!color) return toast.error("Color is undefined")
        const darkenHex = new TinyColor(color.hex).lighten(40).toHexString();
        const lightenHex = new TinyColor(color.hex).darken(40).toHexString();
        setInputColor("#" + color.hex);
        setColorInfo({ darkenHex, lightenHex });
        if (!color.name) {
          const res = await fetch(
            `https://api.color.pizza/v1/?values=${color.hex}`
          );
          const resJson = await res.json();
          dispatch(setColorName({ name: resJson.paletteTitle }));
        }

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

  return (
    <main
      className={
        darkMode
          ? "h-full md:flex-row flex-col overflow-hidden bg-neutral-900 text-white w-full flex gap-6 px-6 md:px-12 transition"
          : "h-full md:flex-row flex-col overflow-hidden  bg-white text-slate-900 w-full flex gap-6 px-6 md:px-12 transition"
      }
    >
      {color == undefined ? (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center relative">
          <LoaderCircle width={30} height={30} className="animate-spin " />
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#" + color.hex,
            animation: loadingScale
              ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              : "",
          }}
          className={`w-full max-w-1/2 h-fit md:h-full py-8 rounded-lg flex items-center justify-center relative`}
        >
          {loadingScale ? (
            <LoaderCircle width={30} height={30} className="animate-spin " />
          ) : (
            <div className="flex flex-col items-center md:gap-0 gap-8 justify-around h-full w-full">
              <div className="flex top-10 h-8 gap-px">
                <input
                  style={{
                    color: loadingScale
                      ? "transparent"
                      : color && chroma.contrast(color.hex, "white") > 2
                      ? colorInfo.lightenHex
                      : colorInfo.darkenHex,
                    backgroundColor: loadingScale
                      ? "transparent"
                      : color && chroma.contrast(color.hex, "white") > 2
                      ? colorInfo.darkenHex
                      : colorInfo.lightenHex,
                  }}
                  onChange={(e) => {
                    if (!e.target.value || e.target.value == "") return;
                    setInputColor(e.target.value);
                  }}
                  value={inputColor}
                  className="font-medium text-sm md:text-lg h-full rounded-l rounded-y outline-none py-3 px-2"
                />
                <button
                  style={{
                    color:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.lightenHex
                        : colorInfo.darkenHex,
                    backgroundColor:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.darkenHex
                        : colorInfo.lightenHex,
                  }}
                  onMouseOver={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor = new TinyColor(
                      currentTarget.style.backgroundColor
                    )
                      .darken(20)
                      .toHexString())
                  }
                  onMouseOut={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor =
                      chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.darkenHex!
                        : colorInfo.lightenHex!)
                  }
                  onClick={() => {
                    const color22 = new TinyColor(inputColor);
                    if (!color22.isValid) return;
                    dispatch(generateNewColor({ hex: color22.toHex() }));
                  }}
                  className="h-full p-1 rounded-r transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                  </svg>
                </button>
              </div>
              <span
                style={{
                  color:
                    color && chroma.contrast(color.hex, "white") > 2
                      ? colorInfo.darkenHex
                      : colorInfo.lightenHex,
                }}
                className={"font-bold text-xl md:text-3xl"}
              >
                {color.name}
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("#" + color.hex);
                    toast.success("HEX code copied to clipboard!");
                  }}
                  style={{
                    fill:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.lightenHex
                        : colorInfo.darkenHex,
                    backgroundColor:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.darkenHex
                        : colorInfo.lightenHex,
                  }}
                  onMouseOver={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor = new TinyColor(
                      currentTarget.style.backgroundColor
                    )
                      .darken(20)
                      .toHexString())
                  }
                  onMouseOut={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor = new TinyColor(
                      currentTarget.style.backgroundColor
                    )
                      .lighten(20)
                      .toHexString())
                  }
                  className="p-3 rounded-xl transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        `?hex=${color.hex}`
                    );
                    toast.success("Share link copied to clipboard!");
                  }}
                  style={{
                    fill:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.lightenHex
                        : colorInfo.darkenHex,
                    backgroundColor:
                      color && chroma.contrast(color.hex, "white") > 2
                        ? colorInfo.darkenHex
                        : colorInfo.lightenHex,
                  }}
                  onMouseOver={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor = new TinyColor(
                      currentTarget.style.backgroundColor
                    )
                      .darken(20)
                      .toHexString())
                  }
                  onMouseOut={({ currentTarget }) =>
                    (currentTarget.style.backgroundColor = new TinyColor(
                      currentTarget.style.backgroundColor
                    )
                      .lighten(20)
                      .toHexString())
                  }
                  className="p-3 rounded-xl transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {color && (
        <div className="flex flex-col text-nowrap overflow-y-auto w-full gap-2 lg:gap-12">
          <div className="flex lg:flex-row flex-col w-full gap-2 xl:gap-12 items-center">
            <div className="flex flex-col justify-start gap-2 lg:gap-6 w-full xl:w-1/3">
              <Format content={"#" + color.hex} title="HEX" />
              <Format content={color.rgb} title="RGB" />
              <Format content={color.hsl} title="HSL" />
              <Format content={color.gl} title="GL" className="xl:hidden" />
            </div>
            <div className="w-full items-start xl:w-1/3 flex flex-col gap-2 lg:gap-6">
              <Format content={color.hsv} title="HSV" />
              <Format content={color.hsi} title="HSI" />
              <Format content={color.lab} title="LAB" />
              <Format content={color.cmyk} title="CMYK" className="xl:hidden" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className={
                darkMode
                  ? "text-gray-400 transition"
                  : "text-slate-900 transition"
              }
            >
              Complementary Color
            </span>
            <div className="flex gap-1 items-center">
              <div
                style={{ backgroundColor: color.complementary }}
                className="aspect-square w-8 rounded-md"
              />
              <span
                className={
                  darkMode
                    ? "text-white w-full font-bold text-xl transition"
                    : "text-slate-900 w-full font-bold text-xl transition"
                }
              >
                {color.complementary}
              </span>
            </div>
          </div>
          <hr className="h-px w-full border border-neutral-300" />
          <div className="flex flex-col gap-2 w-full h-1/2">
            <span
              className={
                darkMode
                  ? "text-gray-400 transition"
                  : "text-slate-900 transition"
              }
            >
              PALETTES
            </span>
            <div
              className={
                darkMode
                  ? "flex flex-col xl:flex-row gap-2 w-full text-gray-300 transition"
                  : "flex flex-col xl:flex-row gap-2 w-full text-slate-700 transition"
              }
            >
              <div className="flex gap-1 w-full xl:w-1/2">
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="font-semibold text-lg ">Analogous</span>
                  {color.palettes.analogous.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        color:
                          chroma.contrast(color, "white") > 2
                            ? "white"
                            : "rgb(15 23 42)",
                      }}
                      className="p-1 rounded group flex items-center justify-center"
                    >
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="font-semibold text-lg">Monochromatic</span>
                  {color.palettes.monochromatic.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        color:
                          chroma.contrast(color, "white") > 2
                            ? "white"
                            : "rgb(15 23 42)",
                      }}
                      className="p-1 rounded group flex items-center justify-center"
                    >
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 xl:w-1/2">
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="font-semibold text-lg">Triad</span>
                  {color.palettes.triad.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        color:
                          chroma.contrast(color, "white") > 2
                            ? "white"
                            : "rgb(15 23 42)",
                      }}
                      className="p-1 rounded group flex items-center justify-center"
                    >
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="font-semibold text-lg">Tetrad</span>
                  {color.palettes.tetrad.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        color:
                          chroma.contrast(color, "white") > 2
                            ? "white"
                            : "rgb(15 23 42)",
                      }}
                      className="p-1 rounded group flex items-center justify-center"
                    >
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
