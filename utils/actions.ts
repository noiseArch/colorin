"use server";
import chroma from "chroma-js";
import {
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearestPalette,
} from "./types";
import defaultPalettes from "../palette.json";

export async function getNearestColorPaletteFamily(
  color: string,
  families: ColorPaletteFamily[]
) {
  const familyWithConfig = families.map((family) => {
    const palettes = family.palettes.map((palette) => {
      return {
        ...palette,
        delta: chroma.deltaE(color, palette.hexcode),
      };
    });

    const nearestPalette = palettes.reduce((prev, curr) =>
      prev.delta < curr.delta ? prev : curr
    );

    return {
      ...family,
      palettes,
      nearestPalette,
    };
  });
  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  const l = chroma(color).hsl()[2];

  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce(
      (prev, curr) => {
        const prevLightness = chroma(prev.hexcode).hsl()[2];
        const currLightness = chroma(curr.hexcode).hsl()[2];

        const deltaPrev = Math.abs(prevLightness - l);
        const deltaCurr = Math.abs(currLightness - l);

        return deltaPrev < deltaCurr ? prev : curr;
      }
    ),
  };

  return paletteFamily;
}

export async function getColorPaletteFamily(color: string, colorName: string) {
  const c1 = chroma(color).hsl();

  const { nearestLightnessPalette, palettes } =
    await getNearestColorPaletteFamily(
      color,
      defaultPalettes as ColorPaletteFamily[]
    );
  const { number, hexcode } = nearestLightnessPalette;

  const c2 = chroma(hexcode).hsl();
  const deltaH = c1[0] - c2[0] || c2[0];
  const sRatio = c1[1] / c2[1];
  const colorPaletteFamily: ColorPaletteFamily = {
    key: colorName,
    palettes: palettes.map((palette) => {
      let hexValue = color;
      const isSame = number === palette.number;

      if (!isSame) {
        const chromaColor = chroma(palette.hexcode).hsl();
        const newH = chromaColor[0] + deltaH;
        const newS = chromaColor[1] * sRatio;
        hexValue = chroma.hsl(newH, newS, chromaColor[2]).hex();
      }

      return {
        hexcode: hexValue,
        number: palette.number,
        name: colorName || hexValue,
      };
    }),
  };
  console.log(colorPaletteFamily)
  return colorPaletteFamily;
}
