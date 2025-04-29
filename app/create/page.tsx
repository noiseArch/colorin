"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import { TinyColor } from "@ctrl/tinycolor";
import Range from "@/components/Range";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { generateNewColor } from "@/utils/redux/colorSlice";
import { LoaderCircle } from "lucide-react";

let isFetching = false;

export default function Home() {
  /* Router Hooks */
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const paramsHex = searchParams.get("hex");
  /* Redux Hooks */
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );
  const dispatch = useAppDispatch();
  const color = useAppSelector((state) => state.colorSlice.color);
  /* States */
  const [loadingScale, setLoadingScale] = useState<boolean>(true);

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
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    setLoadingScale(true);
    const fetchColor = async () => {
      try {
        if (!color) {
          dispatch(
            generateNewColor(paramsHex ? { hex: paramsHex } : undefined)
          );
        }
        if (color) {
          const res = await fetch(
            `https://api.color.pizza/v1/?values=${color.hex}`
          );
          const resJson = await res.json();
          if (!resJson.paletteTitle || !paramsHex)
            return router.push(pathname + "?hex=" + color.hex);
          setOGColor({ hex: paramsHex, name: resJson.paletteTitle });
          setNewColor({ hex: paramsHex, name: resJson.paletteTitle });
          setLoadingScale(false);
        }
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
  }, [color, dispatch, paramsHex, pathname, router]);

  useEffect(() => {
    const editColor = async () => {
      const noModifierApplied = Object.values(modifiers).every(
        (value) => value === 0
      );

      if (noModifierApplied) {
        setNewColor(originalColor);
        return;
      }

      const newColor = new TinyColor(originalColor.hex)
        .brighten(modifiers.brighten)
        .tint(modifiers.tint)
        .saturate(modifiers.saturate)
        .lighten(modifiers.lighten)
        .darken(modifiers.darken)
        .shade(modifiers.shade)
        .desaturate(modifiers.desaturate)
        .spin(modifiers.hue)
        .toHex();

      const res = await fetch(`https://api.color.pizza/v1/?values=${newColor}`);
      const resJson = await res.json();
      setNewColor({
        hex: newColor,
        name: resJson.paletteTitle || newColor,
      });
    };
    editColor();
  }, [modifiers, originalColor]);

  return (
    <main
      className={
        darkMode
          ? "h-full overflow-hidden md:overflow-auto bg-zinc-900 text-white w-full flex flex-col md:justify-between gap-6 px-6 md:px-12 transition"
          : "h-full overflow-hidden md:overflow-auto bg-white text-slate-900 w-full flex flex-col md:justify-between gap-6 px-6 md:px-12 transition"
      }>
      <div className="flex flex-col md:flex-row md:h-2/3 gap-4 md:gap-8 items-center">
        <div
          style={{ backgroundColor: color ? "#" + color.hex : "transparent" }}
          className={`w-full p-8 md:p-0 md:h-full rounded-lg flex flex-col gap-3 items-center justify-center text-center`}>
          {loadingScale ? (
            <LoaderCircle width={30} height={30} className="animate-spin " />
          ) : (
            <>
              <span
                style={{
                  color:
                    originalColor.hex !== "" &&
                    chroma.contrast(originalColor.hex, "white") > 2
                      ? "white"
                      : "rgb(15 23 42)",
                }}
                className="font-bold text-2xl md:text-3xl">
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
                className="font-medium text-lg md:text-xl">
                {"#" + originalColor.hex}
              </span>
            </>
          )}
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={
            "w-[30px] h-[30px] d:w-[50px] md:h-[50px] md:rotate-0 rotate-90 " +
            (darkMode ? "fill-white" : "fill-slate-900")
          }
          viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
          />
        </svg>
        <div
          style={{
            backgroundColor:
              color && loadingScale && newColor.hex !== ""
                ? "#" + color.hex
                : "#" + newColor.hex,
          }}
          className={`relative w-full p-8 h-52 md:p-0 md:h-full rounded-lg flex flex-col gap-3 items-center justify-center text-center`}>
          {loadingScale ? (
            <LoaderCircle width={30} height={30} className="animate-spin " />
          ) : (
            <>
              <span
                style={{
                  color:
                    newColor.hex !== "" &&
                    chroma.contrast(newColor.hex, "white") > 2
                      ? "white"
                      : "rgb(15 23 42)",
                }}
                className="font-bold text-2xl md:text-3xl">
                {newColor.name}
              </span>
              <span
                style={{
                  color:
                    originalColor.hex !== "" &&
                    chroma.contrast(newColor.hex, "white") > 2
                      ? "white"
                      : "rgb(15 23 42)",
                }}
                className="font-medium text-lg md:text-xl">
                {"#" + newColor.hex}
              </span>
              <div
                style={{
                  backgroundColor: new TinyColor(
                    newColor ? newColor.hex : originalColor.hex
                  )
                    .darken(40)
                    .toHexString(),
                }}
                className="flex xl:flex-col bottom-4 right-4 absolute items-center gap-6 rounded-lg p-4">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          isFetching = true;
                          dispatch(
                            generateNewColor({ hex: newColor.hex.slice(1) })
                          );
                          router.push("/?hex=" + newColor.hex.slice(1));
                        }}
                        className="flex items-center gap-2 hover:underline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]"
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
                          viewBox="0 0 16 16">
                          <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Info</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          isFetching = true;
                          dispatch(
                            generateNewColor({ hex: newColor.hex.slice(1) })
                          );
                          router.push(
                            "/scale?hex=" + "?hex=" + newColor.hex.slice(1)
                          );
                        }}
                        className="flex items-center gap-2 hover:underline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]"
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
                          viewBox="0 0 16 16">
                          <path d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 .5.5v5.277l4.147-4.131a.5.5 0 0 1 .707 0l3.535 3.536a.5.5 0 0 1 0 .708L10.261 10H15.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3a3 3 0 0 1-2.121-.879A3 3 0 0 1 0 13.044m6-.21 7.328-7.3-2.829-2.828L6 7.188zM4.5 13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0M15 15v-4H9.258l-4.015 4zM0 .5v12.495zm0 12.495V13z" />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Scale</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-12 w-full items-center md:h-1/3 overflow-y-auto overflow-x-hidden">
        <div className="flex md:flex-row gap-8 md:gap-0 flex-col h-full justify-between w-1/2 md:w-full xl:w-2/3 items-center">
          <Range
            disabled={loadingScale}
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
            disabled={loadingScale}
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
            disabled={loadingScale}
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
            disabled={loadingScale}
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
        <div className="flex md:flex-row gap-8 md:gap-0 flex-col h-full justify-between w-1/2 md:w-full xl:w-2/3 items-center">
          <Range
            disabled={loadingScale}
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
            disabled={loadingScale}
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
            disabled={loadingScale}
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
            disabled={loadingScale}
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
