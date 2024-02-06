import { Color, getIsBaseColor } from './style.type';

interface ColorClassNames {
  bgColor: string;
  hoverBgColor: string;
  selectBgColor: string;
  textColor: string;
  selectTextColor: string;
  hoverTextColor: string;
  borderColor: string;
  selectBorderColor: string;
  hoverBorderColor: string;
  ringColor: string;
  strokeColor: string;
  fillColor: string;
}

/**
 * Returns boolean based on a determination that a color should be considered an "arbitrary"
 * Tailwind CSS class.
 * @see {@link https://tailwindcss.com/docs/background-color#arbitrary-values | Tailwind CSS docs}
 */
const getIsArbitraryColor = (color: Color | string) =>
  color.includes('#') || color.includes('--') || color.includes('rgb');

export function getColorClassNames(color: Color | string, shade?: number): ColorClassNames {
  const isBaseColor = getIsBaseColor(color);
  if (color === 'white' || color === 'black' || color === 'transparent' || !shade || !isBaseColor) {
    const unshadedColor = !getIsArbitraryColor(color) ? color : `[${color}]`;
    return {
      bgColor: `bg-${unshadedColor}`,
      hoverBgColor: `hover:bg-${unshadedColor}`,
      selectBgColor: `ui-selected:bg-${unshadedColor}`,
      textColor: `text-${unshadedColor}`,
      selectTextColor: `ui-selected:text-${unshadedColor}`,
      hoverTextColor: `hover:text-${unshadedColor}`,
      borderColor: `border-${unshadedColor}`,
      selectBorderColor: `ui-selected:border-${unshadedColor}`,
      hoverBorderColor: `hover:border-${unshadedColor}`,
      ringColor: `ring-${unshadedColor}`,
      strokeColor: `stroke-${unshadedColor}`,
      fillColor: `fill-${unshadedColor}`,
    };
  }
  return {
    bgColor: `bg-${color}-${shade}`,
    selectBgColor: `ui-selected:bg-${color}-${shade}`,
    hoverBgColor: `hover:bg-${color}-${shade}`,
    textColor: `text-${color}-${shade}`,
    selectTextColor: `ui-selected:text-${color}-${shade}`,
    hoverTextColor: `hover:text-${color}-${shade}`,
    borderColor: `border-${color}-${shade}`,
    selectBorderColor: `ui-selected:border-${color}-${shade}`,
    hoverBorderColor: `hover:border-${color}-${shade}`,
    ringColor: `ring-${color}-${shade}`,
    strokeColor: `stroke-${color}-${shade}`,
    fillColor: `fill-${color}-${shade}`,
  };
}
