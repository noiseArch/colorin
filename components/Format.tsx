import React from "react";
import { useSelector } from "react-redux";

type Props = {
  format: string;
  title: string;
};

export default function Format({ format, title }: Props) {
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  return (
    <div className="flex flex-col gap-1">
      <span
        className={
          darkMode ? "text-gray-400 transition" : "text-slate-900 transition"
        }
      >
        {title}
      </span>
      <div className="flex w-full justify-between">
        <span className=" font-bold text-xl flex justify-between">
          {format}
        </span>
      </div>
    </div>
  );
}
