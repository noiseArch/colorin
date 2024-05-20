export interface Color {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  hsi: string;
  lab: string;
  cmyk: string;
  gl: string;
  complementary: {
    name: string;
    hex: string;
  };
  palettes: {
    analogous: string[];
    monochromatic: string[];
    triad: string[];
    tetrad: string[];
  };
}

export type TScale = {
  hex: string;
  step: number;
};

/**
 * the color palette number
 */
export type ColorPaletteNumber =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/**
 * the color palette item
 */
export type ColorPaletteItem = {
  /**
   * the color hexcode
   */
  hexcode: string;
  /**
   * the color number
   * @link {@link ColorPaletteNumber}
   */
  number: ColorPaletteNumber;
  /**
   * the color name
   */
  name: string;
};

export type ColorPaletteFamily = {
  /**
   * the color palette family key
   */
  key: string;
  /**
   * the color palette family's palettes
   */
  palettes: ColorPaletteItem[];
};

export type ColorPaletteWithDelta = ColorPaletteItem & {
  delta: number;
};

export type ColorPaletteItemWithName = ColorPaletteItem & {
  name: string;
};

export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestPalette: ColorPaletteWithDelta;
  nearestLightnessPalette: ColorPaletteWithDelta;
};

export type ColorPalette = ColorPaletteFamily & {
  /**
   * the color map of the palette
   */
  colorMap: Map<ColorPaletteNumber, ColorPaletteItem>;
  /**
   * the main color of the palette
   * @description which number is 500
   */
  main: ColorPaletteItemWithName;
  /**
   * the match color of the palette
   */
  match: ColorPaletteItemWithName;
};
