"use client";
import { colorName, getColorPaletteFamily } from "@/utils/actions";
import { Color, TScale } from "@/utils/types";
import chroma from "chroma-js";
import React, { useEffect, useState } from "react";
import Format from "./Format";
import { TinyColor } from "@ctrl/tinycolor";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { generateNewColor } from "@/utils/redux/colorSlice";

type Props = {};

export default function Main({}: Props) {
  /* Router hooks */
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  /* Redux hooks */
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.colorSlice.color);
  const darkMode = useAppSelector((state) => state.darkMode.boolean);
  /* States */
  const [newColor, setNewColor] = useState("#");
  const [loadingScale, setLoadingScale] = useState<boolean>(true);
  const [scale, setScale] = useState<TScale[]>([]);
  const [colorInfo, setColorInfo] = useState<{
    name: string | undefined;
    compName: string | undefined;
  }>({
    name: undefined,
    compName: undefined,
  });

  const paramsHex = searchParams.get("hex");

  useEffect(() => {
    const fetchColor = async () => {
      setLoadingScale(true);
      try {
        if (!color) {
          dispatch(generateNewColor());
        }
        if (color) {
          const name = await colorName(color.hex);
          console.log(name);
          const compName = await colorName(color.complementary);
          const newScale = await getColorPaletteFamily(
            "#" + color.hex,
            name || ""
          );
          if (!newScale) throw new Error("Failed to generate color palette");

          setScale(
            newScale.palettes.map((v) => ({ hex: v.hexcode, step: v.number }))
          );
          setColorInfo({ name, compName });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingScale(false);
      }
    };
    fetchColor();
  }, [color, dispatch]);

  return (
    <main
      className={
        darkMode
          ? "h-full overflow-hidden md:overflow-auto bg-zinc-900 text-white w-full flex flex-col justify-between gap-6 px-6 md:px-12 transition"
          : "h-full overflow-hidden md:overflow-auto bg-white text-slate-900 w-full flex flex-col justify-between gap-6 px-6 md:px-12 transition"
      }
    >
      {color == undefined ? (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center relative">
          <span className="font-bold text-xl md:text-3xl ">
            Color undefined
          </span>
        </div>
      ) : (
        <div
          style={{ backgroundColor: "#" + color.hex }}
          className={`w-full h-1/2 md:h-full rounded-lg flex flex-col items-center justify-center relative`}
        >
          <div className="flex absolute top-10 h-8 gap-px">
            <input
              style={{
                color: loadingScale
                  ? "transparent"
                  : chroma.contrast(scale[2].hex, scale[8].hex) > 2
                  ? scale[2].hex
                  : scale[9].hex,
                backgroundColor: loadingScale ? "transparent" : scale[8].hex,
              }}
              onChange={(e) => {
                if (!e.target.value || e.target.value == "") return;
                setNewColor(e.target.value);
              }}
              value={newColor}
              className="font-medium text-sm md:text-xl h-full rounded-l rounded-y outline-none p-1"
            />
            <button
              style={{
                color: loadingScale
                  ? "transparent"
                  : chroma.contrast(scale[2].hex, scale[8].hex) > 2
                  ? scale[2].hex
                  : scale[2].hex,
                backgroundColor: loadingScale ? "transparent" : scale[8].hex,
              }}
              onClick={() => {
                const color22 = new TinyColor(newColor);
                if (!color22.isValid) return;
                router.replace("/?hex=" + color22.toHex());
              }}
              className="h-full p-1 rounded-r"
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
              color: loadingScale
                ? ""
                : color.hex !== "" && chroma.contrast(color.hex, "white") > 2
                ? scale[2].hex
                : scale[8].hex,
            }}
            className="font-bold text-xl md:text-3xl absolute "
          >
            {colorInfo.name}
          </span>
        </div>
      )}
      {color && (
        <div className="flex flex-col h-2/3 md:h-1/2 overflow-y-auto md:overflow-hidden md:flex-row gap-6 md:gap-12 w-full items-center">
          <span className="block md:hidden">Scroll to see more!</span>
          <div className="flex md:flex-row flex-col justify-between w-full md:w-1/2 gap-8 items-center">
            <div className="flex flex-col gap-6 w-full md:w-1/3">
              <Format format={color.hex} title="HEX" />
              <Format format={color.rgb} title="RGB" />
              <Format format={color.hsl} title="HSL" />
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <Format format={color.hsv} title="HSV" />
              <Format format={color.hsi} title="HSI" />
              <Format format={color.lab} title="LAB" />
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <Format format={color.cmyk} title="CMYK" />
              <Format format={color.gl} title="GL" />
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
                <div className="flex gap-1 items-center group cursor-pointer">
                  <div
                    style={{ backgroundColor: color.complementary }}
                    className="aspect-square w-1/12 rounded-md"
                  />
                  <span
                    className={
                      darkMode
                        ? "text-white w-full font-bold text-xl block group-hover:hidden transition"
                        : "text-slate-900 w-full font-bold text-xl block group-hover:hidden transition"
                    }
                  >
                    {colorInfo.compName}
                  </span>
                  <span
                    className={
                      darkMode
                        ? "text-white w-full font-bold text-xl hidden group-hover:block transition"
                        : "text-slate-900 w-full font-bold text-xl hidden group-hover:block transition"
                    }
                  >
                    {color.complementary}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr className="h-full w-px border border-slate-950 hidden md:block" />
          <div className="flex flex-col gap-2 w-full md:w-1/2">
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
                  ? "flex flex-col md:flex-row gap-2 w-full text-gray-300 transition"
                  : "flex flex-col md:flex-row gap-2 w-full text-slate-700 transition"
              }
            >
              <div className="flex flex-col gap-1 w-full">
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
              <div className="flex flex-col gap-1 w-full">
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
              <div className="flex flex-col gap-1 w-full">
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
              <div className="flex flex-col gap-1 w-full">
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
      )}
    </main>
  );
}
