"use client";
import { genColor, getColorPaletteFamily } from "@/utils/actions";
import { Color, TScale } from "@/utils/types";
import chroma from "chroma-js";
import React, { useEffect, useState } from "react";
import Format from "./Format";
import { TinyColor } from "@ctrl/tinycolor";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {};

export default function Main({}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );
  const [newColor, setNewColor] = useState("#");
  const [loadingScale, setLoadingScale] = useState<boolean>(true);
  const [scale, setScale] = useState<TScale[]>([]);
  const [color, setColor] = useState<Color>({
    name: "",
    hex: "",
    rgb: "",
    hsl: "",
    hsv: "",
    hsi: "",
    lab: "",
    cmyk: "",
    gl: "",
    complementary: {
      name: "",
      hex: "",
    },
    palettes: {
      analogous: [],
      monochromatic: [],
      triad: [],
      tetrad: [],
    },
  });

  useEffect(() => {
    setLoadingScale(true);
    const getAsyncColor = async () => {
      const hex = searchParams.get("hex");
      if (!hex) {
        router.replace(pathname + "?hex=" + chroma.random().hex().slice(1));
        return;
      }
      const res: Color | undefined = await genColor(hex);
      if (!res) {
        router.replace(pathname + "?hex=" + chroma.random().hex().slice(1));
        return;
      }
      setColor(res);
      setNewColor(res.hex);
      const newScale = await getColorPaletteFamily(res.hex, res.name);
      if (newScale === undefined) {
        router.replace(pathname + "?hex=" + chroma.random().hex().slice(1));
        return;
      }
      setScale(
        newScale.palettes.map((v) => {
          return { hex: v.hexcode, step: v.number };
        })
      );
      console.log(scale);
      setLoadingScale(false);
    };
    getAsyncColor();
  }, [searchParams]);

  return (
    <main
      className={
        darkMode
          ? "h-full bg-zinc-900 text-white w-full flex flex-col justify-between gap-6 px-12 transition"
          : "h-full bg-white text-slate-900 w-full flex flex-col justify-between gap-6 px-12 transition"
      }
    >
      {" "}
      <div
        style={{ backgroundColor: color.hex }}
        className={`w-full h-full rounded-lg flex flex-col items-center justify-center relative`}
      >
        <div className="flex absolute top-10 h-8 gap-px">
          <input
            style={{
              color: loadingScale
                ? "#fff"
                : chroma.contrast(scale[2].hex, scale[8].hex) > 2
                ? scale[2].hex
                : scale[9].hex,
              backgroundColor: loadingScale ? "" : scale[8].hex,
            }}
            onChange={(e) => {
              if (!e.target.value || e.target.value == "") return;
              setNewColor(e.target.value);
            }}
            value={newColor}
            className="font-medium text-xl h-full rounded-l rounded-y outline-none p-1"
          />
          <button
            style={{
              color: loadingScale
                ? "#fff"
                : chroma.contrast(scale[2].hex, scale[8].hex) > 2
                ? scale[2].hex
                : scale[2].hex,
              backgroundColor: loadingScale ? "" : scale[8].hex,
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
          className="font-bold text-3xl absolute "
        >
          {color.name}
        </span>
      </div>
      <div className="flex gap-12 w-full items-center">
        <div className="flex justify-between w-1/2 gap-8 items-center">
          <div className="flex flex-col gap-6 w-1/3">
            <Format format={color.hex} title="HEX" />
            <Format format={color.rgb} title="RGB" />
            <Format format={color.hsl} title="HSL" />
          </div>
          <div className="w-1/3 flex flex-col gap-6">
            <Format format={color.hsv} title="HSV" />
            <Format format={color.hsi} title="HSI" />
            <Format format={color.lab} title="LAB" />
          </div>
          <div className="w-1/3 flex flex-col gap-6">
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
                  style={{ backgroundColor: color.complementary.hex }}
                  className="aspect-square w-1/12 rounded-md"
                />
                <span
                  className={
                    darkMode
                      ? "text-white w-full font-bold text-xl block group-hover:hidden transition"
                      : "text-slate-900 w-full font-bold text-xl block group-hover:hidden transition"
                  }
                >
                  {color.complementary.name}
                </span>
                <span
                  className={
                    darkMode
                      ? "text-white w-full font-bold text-xl hidden group-hover:block transition"
                      : "text-slate-900 w-full font-bold text-xl hidden group-hover:block transition"
                  }
                >
                  {color.complementary.hex}
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr className="h-full w-px border border-slate-950" />
        <div className="flex flex-col gap-2 w-1/2">
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
                ? "flex gap-2 w-full text-gray-300 transition"
                : "flex gap-2 w-full text-slate-700 transition"
            }
          >
            <div className="flex flex-col gap-1 w-full">
              <span className="font-semibold text-lg ">Analogous</span>
              {color.palettes.analogous.map((color) => (
                <div
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
              {color.palettes.monochromatic.map((color) => (
                <div
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
              {color.palettes.triad.map((color) => (
                <div
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
              {color.palettes.tetrad.map((color) => (
                <div
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
    </main>
  );
}
