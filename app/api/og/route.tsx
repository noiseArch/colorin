import { colorName, getColorPaletteFamily } from "@/utils/actions";
import { Color, ColorPaletteNumber } from "@/utils/types";
import { contrast } from "chroma-js";
import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hex = searchParams.get("hex");
    if (!hex) throw Error("Failed to fetch color from URL.");
    const name: string | undefined = await colorName(hex);
    if (!name) throw Error("Failed to fetch color from URL.");

    const scale: { hex: string; step: ColorPaletteNumber }[] = (
      await getColorPaletteFamily(hex, name)
    ).palettes.map((v) => {
      return { hex: v.hexcode, step: v.number };
    });

    return new ImageResponse(
      (
        <div
          tw="flex w-full h-full text-center items-center justify-center flex-col gap-[12px]"
          style={{
            fontSize: 42,
            background: hex,
            color: contrast(hex, "white") > 2 ? scale[2].hex : scale[8].hex,
            fontWeight: 700,
          }}
        >
          <span>{name}</span>
          <span>{hex}</span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Dynamic Metadata generation failed", { status: 500 });
  }
}
