import { genColor, getColorPaletteFamily } from "@/utils/actions";
import { Color } from "@/utils/types";
import chroma from "chroma-js";
import { ImageResponse } from "next/og";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { hex: string } }) {
  const hex = params.hex;
  const color: Color | undefined = await genColor(hex);
  if (!color) return;
  const scale = (
    await getColorPaletteFamily(color.hex, color.name)
  ).palettes.map((v) => {
    return { hex: v.hexcode, step: v.number };
  });
  const img = new ImageResponse(
    (
      <div
        style={{
          fontSize: 42,
          background: color.hex,
          color:
            chroma.contrast(color.hex, "white") > 2
              ? scale[2].hex
              : scale[8].hex,
          fontWeight: 700,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>{color.name}</span>
        <span>{color.hex}</span>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 42,
          background: color.hex,
          color:
            chroma.contrast(color.hex, "white") > 2
              ? scale[2].hex
              : scale[8].hex,
          fontWeight: 700,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span>{color.name}</span>
        <span>{color.hex}</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
