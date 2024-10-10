import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Color } from "../types";
import { TinyColor } from "@ctrl/tinycolor";
import chroma from "chroma-js";

const initialState: { color: Color | undefined } = {
  color: undefined,
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    generateNewColor: (
      state,
      action: PayloadAction<{ hex: string } | undefined>
    ) => {
      const hex = action.payload
        ? action.payload.hex
        : Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');;

      const tinyColor = new TinyColor(hex);
      const colorChroma = chroma("#" + hex);
      const color = {
        hex,
        rgb: tinyColor.toRgbString(),
        hsl: tinyColor.toHslString(),
        hsv: tinyColor.toHsvString(),
        hsi: colorChroma
          .hsi()
          .map((num) => Math.round((num + Number.EPSILON) * 100) / 100)
          .toString()
          .replaceAll(",", ", "),
        lab: colorChroma
          .lab()
          .map((num) => Math.round((num + Number.EPSILON) * 100) / 100)
          .toString()
          .replaceAll(",", ", "),
        cmyk: colorChroma
          .cmyk()
          .map((num) => Math.round((num + Number.EPSILON) * 100) / 100)
          .toString()
          .replaceAll(",", ", "),
        gl: colorChroma
          .gl()
          .map((num) => Math.round((num + Number.EPSILON) * 100) / 100)
          .toString()
          .replaceAll(",", ", "),
        complementary: tinyColor.complement().toHexString(),
        palettes: {
          analogous: tinyColor
            .analogous()
            .map((tColor) => tColor.toHexString()),
          monochromatic: tinyColor
            .monochromatic()
            .map((tColor) => tColor.toHexString()),
          triad: tinyColor.triad().map((tColor) => tColor.toHexString()),
          tetrad: tinyColor.tetrad().map((tColor) => tColor.toHexString()),
        },
      };
      state.color = color;
      console.log(state.color)
    },
  },
});

export const { generateNewColor } = colorSlice.actions;

export default colorSlice.reducer;
