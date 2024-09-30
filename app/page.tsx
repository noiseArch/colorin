import { Metadata } from "next";
import Main from "@/components/Main";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: {};
  searchParams: { hex: string };
}): Promise<Metadata> {
  const hex = props.searchParams.hex
  const ogUrl = new URL(`https://colorinly.vercel.app/api/og`)
  ogUrl.searchParams.set("hex", hex)
  return {
    title: "colorinly - " + hex,
    metadataBase: new URL("https://colorinly.vercel.app/"),
    openGraph: {
      title: "colorinly - " + hex,
      description: "",
      images: [
        {
          width: 1200,
          height: 630,
          url: ogUrl.toString()
        }
      ]
    }
  };
}

export default function Home() {
  return (
    <Suspense>
      <Main />
    </Suspense>
  );
}
