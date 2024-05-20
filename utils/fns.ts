import colorNames from "color-name-list";
import nearestColor from "nearest-color";
import { getColorPaletteFamily } from "./actions";
import chroma from "chroma-js";
import { TScale } from "./types";
import { calcAPCA } from "apca-w3";

export function colorName(hex: string) {
  if (!hex || hex == "") return;
  const colors = colorNames.reduce(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {}
  );
  const nearest = nearestColor.from(colors);
  return nearest(hex)?.name;
}

export const generateSVG = (scale: string[]) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", "872");
  svg.setAttribute("name", "872");
  svg.setAttribute("height", "80");
  svg.setAttribute("viewBox", "0 0 872 80");
  svg.setAttribute("fill", "none");
  svg.setAttribute("height", "80");
  scale.forEach((c, i) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", `${88 * i}`);
    rect.setAttribute("width", "80");
    rect.setAttribute("height", "80");
    rect.setAttribute("rx", "8");
    rect.setAttribute("fill", c);
    svg.appendChild(rect);
  });
  navigator.clipboard.writeText(svg.outerHTML);
};

export const generateTailwind = async (hex: string, name: string) => {
  const colorScale = await getColorPaletteFamily(hex, name);
  const formats = {
    hex:
      `'${name.toLowerCase().replaceAll(" ", "-")}': {\n` +
      colorScale.palettes
        .map((p) => `\t'${p.number}': '${p.hexcode}'`)
        .reduce((a, b) => a + ", \n" + b) +
      "\n}",
    oklch:
      `'${name.toLowerCase().replaceAll(" ", "-")}': {\n` +
      colorScale.palettes
        .map((p) => {
          const oklch = chroma(p.hexcode)
            .oklch()
            .map((num) => Math.round((num + Number.EPSILON) * 100) / 100);
          return `\t'${p.number}': 'oklch(${oklch[0] * 100}% ${oklch[1]} ${
            oklch[2]
          })'`;
        })
        .reduce((a, b) => a + ", \n" + b) +
      "\n}",
    hsl:
      `'${name.toLowerCase().replaceAll(" ", "-")}': {\n` +
      colorScale.palettes
        .map((p) => {
          const hsl = chroma(p.hexcode).hsl();
          return `\t'${p.number}': 'hsl(${Math.round(hsl[0])} ${
            Math.round((hsl[1] * 100 + Number.EPSILON) * 100) / 100
          }% ${Math.round((hsl[2] * 100 + Number.EPSILON) * 100) / 100}%)'`;
        })
        .reduce((a, b) => a + ", \n" + b) +
      "\n}",
    rgb:
      `'${name.toLowerCase().replaceAll(" ", "-")}': {\n` +
      colorScale.palettes
        .map((p) => {
          const rgb = chroma(p.hexcode)
            .rgb()
            .map((n) => Math.round((n + Number.EPSILON) * 100) / 100);
          return `\t'${p.number}': 'rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})'`;
        })
        .reduce((a, b) => a + ", \n" + b) +
      "\n}",
  };
  return formats;
};
export const generateSCSS = async (hex: string, name: string) => {
  const colorScale = await getColorPaletteFamily(hex, name);
  const formats = {
    hex: colorScale.palettes
      .map(
        (p) =>
          `$${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: ${
            p.hexcode
          };\n`
      )
      .reduce((a, b) => a + b),
    oklch: colorScale.palettes
      .map((p) => {
        const oklch = chroma(p.hexcode)
          .oklch()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `$${name.toLowerCase().replaceAll(" ", "-")}-${
          p.number
        }: oklch(${oklch[0] * 100}% ${oklch[1]} ${oklch[2]});\n`;
      })
      .reduce((a, b) => a + b),
    hsl: colorScale.palettes
      .map((p) => {
        const hsl = chroma(p.hexcode)
          .hsl()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `$${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: hsl(${
          hsl[0]
        } ${hsl[1]}% ${hsl[2]}%);\n`;
      })
      .reduce((a, b) => a + b),
    rgb: colorScale.palettes
      .map((p) => {
        const rgb = chroma(p.hexcode)
          .rgb()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `$${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: rgb(${
          rgb[0]
        } ${rgb[1]} ${rgb[2]});\n`;
      })
      .reduce((a, b) => a + b),
  };
  return formats;
};
export const generateCSS = async (hex: string, name: string) => {
  const colorScale = await getColorPaletteFamily(hex, name);
  const formats = {
    hex: colorScale.palettes
      .map(
        (p) =>
          `--${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: ${
            p.hexcode
          };\n`
      )
      .reduce((a, b) => a + b),
    oklch: colorScale.palettes
      .map((p) => {
        const oklch = chroma(p.hexcode)
          .oklch()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `--${name.toLowerCase().replaceAll(" ", "-")}-${
          p.number
        }: oklch(${oklch[0] * 100}% ${oklch[1]} ${oklch[2]});\n`;
      })
      .reduce((a, b) => a + b),
    hsl: colorScale.palettes
      .map((p) => {
        const hsl = chroma(p.hexcode)
          .hsl()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `--${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: hsl(${
          hsl[0]
        } ${hsl[1]}% ${hsl[2]}%);\n`;
      })
      .reduce((a, b) => a + b),
    rgb: colorScale.palettes
      .map((p) => {
        const rgb = chroma(p.hexcode)
          .rgb()
          .map((num) => Math.round(((num + Number.EPSILON) * 100) / 100));
        return `--${name.toLowerCase().replaceAll(" ", "-")}-${p.number}: rgb(${
          rgb[0]
        } ${rgb[1]} ${rgb[2]});\n`;
      })
      .reduce((a, b) => a + b),
  };
  return formats;
};
export const generateVariables = async (hex: string, name: string) => {
  const formats = {
    tw: await generateTailwind(hex, name),
    scss: await generateSCSS(hex, name),
    css: await generateCSS(hex, name),
  };
  return formats;
};

export type TRow = {
  color1: string;
  color2: string;
  contrast: number;
}[];
export type TGrid = TRow[];

export const createWCAGGrid = (scale: TScale[]) => {
  const grid: TGrid = [];
  const scaleWithWB = ["white", ...scale.flatMap((s) => s.hex), "black"];
  for (let i = 0; i < scaleWithWB.length; i++) {
    const color1 = scaleWithWB[i];
    const row = [];
    for (let j = 0; j < scaleWithWB.length; j++) {
      const color2 = scaleWithWB[j];
      row.push({
        color1,
        color2,
        contrast:
          Math.round((chroma.contrast(color1, color2) + Number.EPSILON) * 10) /
          10,
      });
    }
    grid.push(row);
  }
  return grid;
};
export const createAPCAGrid = (scale: TScale[]) => {
  const grid: TGrid = [];
  const scaleWithWB = ["white", ...scale.flatMap((s) => s.hex), "black"];
  for (let i = 0; i < scaleWithWB.length; i++) {
    const color1 = scaleWithWB[i];
    const row = [];
    for (let j = 0; j < scaleWithWB.length; j++) {
      const color2 = scaleWithWB[j];
      row.push({
        color1,
        color2,
        contrast: Math.round(calcAPCA(color1, color2) as number),
      });
    }
    grid.push(row);
  }
  return grid;
};
