import { ChangeEvent, useCallback, useRef } from "react";
import { useSelector } from "react-redux";

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hex: string;
  title: string;
  disabled?: boolean;
};

export default function Range({ onChange, hex, title, disabled }: Props) {
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(e);
      }, 500);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-1">
      <span className={darkMode ? "text-white" : "text-slate-900"}>
        {title}
      </span>
      <input
        disabled={disabled}
        onChange={debouncedHandleChange}
        style={{ accentColor: hex, backgroundColor: hex }}
        className="rangeInput"
        type="range"
        step={1}
        defaultValue={0}
        name=""
        id=""
      />
    </div>
  );
}
