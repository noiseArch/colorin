import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Color } from "../types";
import { TinyColor } from "@ctrl/tinycolor";
import chroma from "chroma-js";

const initialState: { color: Color | undefined } = {
  color: undefined,
};
// TODO: Ahorrate un par de API calls guardando el nombre del color
const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColorName: (state, action: PayloadAction<{ name: string }>) => {
      if (!state.color) return;
      state.color.name = action.payload.name;
    },
    generateNewColor: (
      state,
      action: PayloadAction<{ name?: string; hex: string } | undefined>
    ) => {
      const hex = action.payload
        ? action.payload.hex
        : Math.floor(Math.random() * 16777216)
            .toString(16)
            .padStart(6, "0");

      const tinyColor = new TinyColor(hex);
      const colorChroma = chroma("#" + hex);
      const color = {
        hex,
        name: action.payload ? action.payload.name : undefined,
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
    },
  },
});

export const { generateNewColor, setColorName } = colorSlice.actions;

export default colorSlice.reducer;
