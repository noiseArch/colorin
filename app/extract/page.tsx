"use client";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { useCallback, useState } from "react";
import { prominent } from "color.js";
import NextImage from "next/image";
import chroma from "chroma-js";
import Link from "next/link";

declare type Hex = string;
declare type Output = Hex | Rgb | (Hex | Rgb)[];
declare type Rgb = [r: number, g: number, b: number];

export default function Home() {
  const [image, setImage] = useState<
    { src: string; w: number; h: number } | undefined
  >(undefined);
  const [palette, setPalette] = useState<Hex[] | undefined>(undefined);
  const darkMode = useSelector(
    (state: { darkMode: { boolean: boolean } }) => state.darkMode.boolean
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        if (!reader.result) return console.log("file undefined");
        const base64 = reader.result.toString();
        var image = new Image();
        image.src = base64;
        image.onload = () => {
          // Do whatever you want with the file contents
          setImage({ src: base64, w: image.width, h: image.height });
          prominent(base64, { amount: 5, format: "hex", group: 30 })
            .then((s) => {
              if (s && Array.isArray(s) && typeof s[0] === "string")
                setPalette(s as string[]);
            })
            .catch(console.error);
        };
      };
      reader.readAsDataURL(file);
    });
  }, []);

  return (
    <main
      className={
        darkMode
          ? "h-full bg-zinc-900 text-white w-full flex flex-col gap-6 px-12 transition"
          : "h-full text-slate-900 w-full flex  flex-col gap-6 px-12 transition"
      }
    >
      {!image ? (
        <Dropzone
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
          }}
          onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="w-full h-1/2 rounded-lg border-2 border-black border-dashed flex flex-col items-center justify-center relative cursor-pointer"
            >
              <input {...getInputProps()} />
              <span>Load Image</span>
            </div>
          )}
        </Dropzone>
      ) : (
        <div
          style={{
            maxHeight: "50%",
            aspectRatio: `${image.w} / ${image.h}`,
            height: image.h,
          }}
          className="group w-fit h-fit flex flex-col self-center justify-center relative"
        >
          <NextImage alt="" src={image.src} fill />
          <Dropzone
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg", ".jpg"],
            }}
            onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="absolute bg-black flex items-center justify-center w-full h-full bg-opacity-30 opacity-0 group-hover:opacity-100 transition"
              >
                <input {...getInputProps()} />
                <span
                  style={{
                    backgroundColor: palette ? palette[0] : "beige",
                    color:
                      chroma.contrast("white", palette ? palette[0] : "beige") > 2
                        ? "white"
                        : "rgb(15 23 42)",
                  }}
                  className="rounded-full font-medium px-4 py-2"
                >
                  Change Image
                </span>
              </div>
            )}
          </Dropzone>
        </div>
      )}
      <div className="flex gap-12 w-full">
        <div className="flex flex-col gap-2 w-full">
          <span
            className={
              darkMode
                ? "text-gray-400 transition"
                : "text-slate-900 transition"
            }
          >
            PALETTE
          </span>
          <div
            className={
              darkMode
                ? "flex gap-2 w-full text-gray-300 transition"
                : "flex gap-2 w-full text-slate-700 transition"
            }
          >
            {palette ? (
              palette.map((c) => (
                <div
                  style={{ backgroundColor: c }}
                  className="w-full h-32 flex flex-col items-center justify-around"
                >
                  <span
                    style={{
                      color:
                        chroma.contrast("white", c) > 2
                          ? "white"
                          : "rgb(15 23 42)",
                    }}
                  >
                    {c}
                  </span>
                  <div
                    style={{
                      color:
                        chroma.contrast("white", c) > 2
                          ? "white"
                          : "rgb(15 23 42)",
                    }}
                    className="flex gap-4"
                  >
                    <Link href={"/?hex=" + c.split("#")[1]}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-box-arrow-up-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                        />
                      </svg>
                    </Link>
                    <Link href={"/create?hex=" + c.split("#")[1]}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pen"
                        viewBox="0 0 16 16"
                      >
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <span>Loading</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
