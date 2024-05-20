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
  return {
    title: "colorar",
    metadataBase: new URL('https://spectraly.vercel.app/'),
  };
}

export default function Home() {
  return <Main />;
}
