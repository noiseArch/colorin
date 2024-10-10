"use client";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { generateNewColor } from "@/utils/redux/colorSlice";
import { changeTheme } from "@/utils/redux/darkModeSlice";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.darkMode.boolean);
  const color = useAppSelector((state) => state.colorSlice.color);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <nav
      className={
        darkMode
          ? "bg-zinc-900 text-white w-full h-24 justify-between items-center flex flex-col md:flex-row py-4 px-6 md:px-12 transition"
          : "bg-white text-slate-800 w-full h-24 justify-between items-center flex flex-col md:flex-row py-4 px-6 md:px-12 transition"
      }
    >
      <Link
        className="font-semibold text-xl relative group"
        href={"/?" + searchParams.toString()}
      >
        colorinly
        <div
          className="absolute bottom-0 left-0 h-[3px] w-full origin-bottom-right scale-x-0 transform bg-slate-900 transition duration-300 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"
          style={{
            backgroundColor: searchParams.get("hex")
              ? "#" + searchParams.get("hex")
              : "black",
          }}
        />
      </Link>
      <div className="flex gap-4 items-center">
        <Link className="relative group" href={"/?" + searchParams.toString()}>
          Info
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full origin-bottom-right scale-x-0 transform bg-slate-900 transition duration-300 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"
            style={{
              backgroundColor: searchParams.get("hex")
                ? "#" + searchParams.get("hex")
                : "black",
            }}
          />
        </Link>

        <Link
          className="relative group"
          href={"/scale?" + searchParams.toString()}
        >
          Scale
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full origin-bottom-right scale-x-0 transform bg-slate-900 transition duration-300 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"
            style={{
              backgroundColor: searchParams.get("hex")
                ? "#" + searchParams.get("hex")
                : "black",
            }}
          />
        </Link>
        <Link
          className="relative group"
          href={"/create?" + searchParams.toString()}
        >
          Create
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full origin-bottom-right scale-x-0 transform bg-slate-900 transition duration-300 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"
            style={{
              backgroundColor: searchParams.get("hex")
                ? "#" + searchParams.get("hex")
                : "black",
            }}
          />
        </Link>
        <button
          onClick={() => {
            dispatch(generateNewColor());
            router.push(pathname + "?hex=" + color?.hex);
          }}
          className="flex items-center gap-1 group relative"
        >
          <span>Random</span>
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full origin-bottom-right scale-x-0 transform bg-slate-900 transition duration-300 ease-out group-hover:origin-bottom-left group-hover:scale-x-100"
            style={{
              backgroundColor: searchParams.get("hex")
                ? "#" + searchParams.get("hex")
                : "black",
            }}
          />
        </button>
        <button onClick={() => dispatch(changeTheme(!darkMode))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className={
              darkMode
                ? "fill-white hover:fill-gray-300 active:fill-gray-400 transition"
                : "fill-slate-800 hover:fill-slate-900 active:fill-slate-950 transition"
            }
            viewBox="0 0 16 16"
          >
            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
