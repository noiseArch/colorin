import { Metadata } from "next";
import Main from "@/components/Main";
import { ImageResponse } from "next/og";
import chroma from "chroma-js";
import { genColor, getColorPaletteFamily } from "@/utils/actions";
import { Color } from "@/utils/types";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: {
  params: {};
  searchParams: { hex: string };
}): Promise<Metadata> {
  const hex = props.searchParams.hex;
  const color: Color | undefined = await genColor(hex);
  let imgURL;
  if (color) {
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
    const blob = await img.blob();
    let buffer = Buffer.from(await blob.arrayBuffer());
    imgURL = "data:" + blob.type + ";base64," + buffer.toString("base64");
  }
  return {
    title: "colorar",
    openGraph: {
      images: imgURL ? [imgURL] : [],
    },
  };
}

export default function Home() {
  return <Main />;
}
