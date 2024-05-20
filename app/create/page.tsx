"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import { TinyColor } from "@ctrl/tinycolor";
import { colorName } from "@/utils/fns";
import Range from "@/components/Range";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  const [originalColor, setOGColor] = useState<{ name: string; hex: string }>({
    name: "",
    hex: "",
  });

  const [newColor, setNewColor] = useState<{
    name: string;
    hex: string;
  }>({
    name: "",
    hex: "",
  });
  const [modifiers, setModifiers] = useState({
    brighten: 0,
    tint: 0,
    saturate: 0,
    lighten: 0,
    darken: 0,
    shade: 0,
    desaturate: 0,
    hue: 0,
  });

  const firstRender = useRef(true);

  useEffect(() => {
    const getAsyncColor = async () => {
      const hex = searchParams.get("hex");
      if (!hex) {
        router.push(pathname + "?hex=" + chroma.random().hex().slice(1));
        return;
      }
      const color = { hex: "#" + hex, name: colorName(hex) || hex };
      setOGColor(color);
      setNewColor(color);
    };
    getAsyncColor();
  }, [searchParams]);

  useEffect(() => {
    const newColor = new TinyColor(originalColor.hex)
      .brighten(modifiers.brighten)
      .tint(modifiers.tint)
      .saturate(modifiers.saturate)
      .darken(modifiers.darken)
      .shade(modifiers.shade)
      .desaturate(modifiers.desaturate)
      .spin(modifiers.hue)
      .toHexString();
    setNewColor({
      hex: newColor,
      name: colorName(newColor) || newColor,
    });
  }, [modifiers]);

  return (
    <main
      className={
        darkMode
          ? "h-full bg-zinc-900 text-white w-full flex flex-col justify-between gap-6 px-12 transition"
          : "h-full bg-white text-slate-900 w-full flex flex-col justify-between gap-6 px-12 transition"
      }
    >
      <div className="flex h-full gap-8 items-center">
        <div
          style={{ backgroundColor: originalColor.hex }}
          className={`w-full h-full rounded-lg flex flex-col gap-3 items-center justify-center`}
        >
          <span
            style={{
              color:
                originalColor.hex !== "" &&
                chroma.contrast(originalColor.hex, "white") > 2
                  ? "white"
                  : "rgb(15 23 42)",
            }}
            className="font-bold text-3xl"
          >
            {originalColor.name}
          </span>
          <span
            style={{
              color:
                originalColor.hex !== "" &&
                chroma.contrast(originalColor.hex, "white") > 2
                  ? "white"
                  : "rgb(15 23 42)",
            }}
            className="font-medium text-xl"
          >
            {originalColor.hex}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          className={darkMode ? "fill-white" : "fill-slate-900"}
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
          />
        </svg>
        <div
          style={{ backgroundColor: newColor.hex }}
          className={`w-full h-full rounded-lg flex flex-col gap-3 items-center justify-center`}
        >
          <span
            style={{
              color:
                newColor.hex !== "" &&
                chroma.contrast(newColor.hex, "white") > 2
                  ? "white"
                  : "rgb(15 23 42)",
            }}
            className="font-bold text-3xl"
          >
            {colorName(newColor.hex)}
          </span>
          <span
            style={{
              color:
                originalColor.hex !== "" &&
                chroma.contrast(originalColor.hex, "white") > 2
                  ? "white"
                  : "rgb(15 23 42)",
            }}
            className="font-medium text-xl"
          >
            {newColor.hex}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-12 w-full items-center">
        <div className="flex justify-between w-1/2 items-center">
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                brighten: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="BRIGHTEN"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                tint: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="TINT"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                saturate: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="SATURATE"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                lighten: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="LIGHTEN"
          />
        </div>
        <div className="flex justify-between w-1/2 items-center">
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                darken: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="DARKEN"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                shade: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="SHADE"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                desaturate: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="DESATURATE"
          />
          <Range
            onChange={(e) => {
              setModifiers((m) => ({
                ...m,
                hue: e.target.valueAsNumber,
              }));
            }}
            color={originalColor}
            title="HUE"
          />
        </div>
      </div>
    </main>
  );
}
