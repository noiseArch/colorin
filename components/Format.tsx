import React from "react";
import { useSelector } from "react-redux";

type Props = {
  content: string;
  title: string;
  className?: string;
};

export default function Format({ content, title, className }: Props) {
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  return (
    <div className={"flex flex-col gap-1" + " " + className}>
      <span
        className={
          darkMode ? "text-gray-400 transition" : "text-slate-900 transition"
        }
      >
        {title}
      </span>
      <div className="flex w-full justify-between">
        <span className=" font-bold text-xl flex justify-between">
          {content}
        </span>
      </div>
    </div>
  );
}
