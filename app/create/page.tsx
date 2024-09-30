"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import { TinyColor } from "@ctrl/tinycolor";
import { colorName } from "@/utils/fns";
import Range from "@/components/Range";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

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
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const newColor = new TinyColor(originalColor.hex)
      .brighten(modifiers.brighten)
      .tint(modifiers.tint)
      .saturate(modifiers.saturate)
      .lighten(modifiers.lighten)
      .darken(modifiers.darken)
      .shade(modifiers.shade)
      .desaturate(modifiers.desaturate)
      .spin(modifiers.hue)
      .toHexString();
    setNewColor({
      hex: newColor,
      name: colorName(newColor) || newColor,
    });
  }, [modifiers, originalColor.hex]);

  return (
    <main
      className={
        darkMode
          ? "h-full overflow-hidden md:overflow-auto bg-zinc-900 text-white w-full flex flex-col justify-between gap-6 px-12 transition"
          : "h-full overflow-hidden md:overflow-auto bg-white text-slate-900 w-full flex flex-col justify-between gap-6 px-12 transition"
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
          className={`relative w-full h-full rounded-lg flex flex-col gap-3 items-center justify-center`}
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
                chroma.contrast(newColor.hex, "white") > 2
                  ? "white"
                  : "rgb(15 23 42)",
            }}
            className="font-medium text-xl"
          >
            {newColor.hex}
          </span>
          <div
            style={{
              backgroundColor: new TinyColor(
                newColor ? newColor.hex : originalColor.hex
              )
                .darken(40)
                .toHexString(),
            }}
            className="flex flex-col right-10 absolute items-center gap-6 rounded-lg p-4"
          >
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={"/?hex=" + newColor.hex.slice(1)}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill={
                        newColor.hex !== "" &&
                        chroma.contrast(
                          new TinyColor(
                            newColor ? newColor.hex : originalColor.hex
                          )
                            .darken(40)
                            .toHexString(),
                          "white"
                        ) > 4.5
                          ? "white"
                          : "black"
                      }
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                    </svg>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Info</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={"/scale?hex=" + newColor.hex.slice(1)}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill={
                        newColor.hex !== "" &&
                        chroma.contrast(
                          new TinyColor(
                            newColor ? newColor.hex : originalColor.hex
                          )
                            .darken(40)
                            .toHexString(),
                          "white"
                        ) > 4.5
                          ? "white"
                          : "black"
                      }
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 .5.5v5.277l4.147-4.131a.5.5 0 0 1 .707 0l3.535 3.536a.5.5 0 0 1 0 .708L10.261 10H15.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3a3 3 0 0 1-2.121-.879A3 3 0 0 1 0 13.044m6-.21 7.328-7.3-2.829-2.828L6 7.188zM4.5 13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0M15 15v-4H9.258l-4.015 4zM0 .5v12.495zm0 12.495V13z" />
                    </svg>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Scale</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
