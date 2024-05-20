"use client";
import { changeTheme } from "@/utils/redux/darkModeSlice";
import chroma from "chroma-js";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

export default function Navbar({}: Props) {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  console.log(darkMode);
  return (
    <nav
      className={
        darkMode
          ? "bg-zinc-900 text-white w-full h-24 justify-between items-center flex py-4 px-12 transition"
          : "bg-white text-slate-800 w-full h-24 justify-between items-center flex py-4 px-12 transition"
      }
    >
      <Link
        className="font-semibold text-xl"
        href={"/?" + searchParams.toString()}
      >
        colorar
      </Link>
      <div className="flex gap-4 items-center">
        <Link href={"/?" + searchParams.toString()}>Home</Link>

        <Link href={"/scale?" + searchParams.toString()}>Scale</Link>
        <Link href={"/create?" + searchParams.toString()}>Create</Link>
        <Link href={"/extract"}>Extract</Link>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("hex", chroma.random().hex().slice(1));
            console.log(params.toString());
            router.push(pathname + "?" + params.toString());
          }}
          className="flex items-center gap-1 group"
        >
          <span>Random</span>
        </button>
        <button onClick={() => dispatch(changeTheme(!darkMode))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className={
              darkMode
                ? "dark:fill-white dark:hover:fill-gray-300 dark:active:fill-gray-400 transition"
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
