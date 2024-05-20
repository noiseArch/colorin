import { colorName } from "@/utils/fns";
import { TinyColor } from "@ctrl/tinycolor";
import chroma from "chroma-js";
import { ChangeEvent } from "react";
import { useSelector } from "react-redux";

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  color: { hex: string; name: string };
  title: string;
};

export default function Range({ onChange, color, title }: Props) {
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  return (
    <div className="flex flex-col gap-1">
      <span className={darkMode ? "text-white" : "text-slate-900"}>{title}</span>
      <style jsx>{`
        .inputRange {
          background-color: "${color}";
        }
      `}</style>
      <input
        onChange={onChange}
        style={{ accentColor: color.hex }}
        className={"inputRange"}
        type="range"
        step={1}
        defaultValue={0}
        name=""
        id=""
      />
    </div>
  );
}
