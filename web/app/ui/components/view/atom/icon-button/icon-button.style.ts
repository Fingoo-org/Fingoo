import { Color, IconVariant, Size, colorPalette, getColorClassNames } from '@/app/utils/style';
import { twMerge } from 'tailwind-merge';

export const Sizes: { [key: string]: Size } = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

export const IconVariants: { [key: string]: IconVariant } = {
  Simple: 'simple',
  Outlined: 'outlined',
};

export type WrapperProportionTypes = {
  paddingX: string;
  paddingY: string;
};

export const wrapperProportions: { [size: string]: WrapperProportionTypes } = {
  xs: {
    paddingX: 'px-1.5',
    paddingY: 'py-1.5',
  },
  sm: {
    paddingX: 'px-1.5',
    paddingY: 'py-1.5',
  },
  md: {
    paddingX: 'px-2',
    paddingY: 'py-2',
  },
  lg: {
    paddingX: 'px-2',
    paddingY: 'py-2',
  },
  xl: {
    paddingX: 'px-2.5',
    paddingY: 'py-2.5',
  },
};

export const iconSizes: {
  [size: string]: {
    height: string;
    width: string;
  };
} = {
  xs: {
    height: 'h-3',
    width: 'w-3',
  },
  sm: {
    height: 'h-5',
    width: 'w-5',
  },
  md: {
    height: 'h-5',
    width: 'w-5',
  },
  lg: {
    height: 'h-7',
    width: 'w-7',
  },
  xl: {
    height: 'h-9',
    width: 'w-9',
  },
};
export type ShapeTypes = {
  rounded: string;
  border: string;
  ring: string;
  shadow: string;
};

export const shape: { [style in IconVariant]: ShapeTypes } = {
  simple: {
    rounded: '',
    border: '',
    ring: '',
    shadow: '',
  },
  outlined: {
    rounded: 'rounded-lg',
    border: 'border',
    ring: 'ring-2',
    shadow: '',
  },
};

export const getIconColors = (variant: IconVariant, color: Color) => {
  switch (variant) {
    case 'simple':
      return {
        textColor: getColorClassNames(color, 500).textColor,
        bgColor: '',
        borderColor: '',
        ringColor: '',
        hoverTextColor: '',
        hoverBgColor: '',
      };
    case 'outlined':
      return {
        textColor: getColorClassNames(color, colorPalette.text).textColor,
        bgColor: twMerge(getColorClassNames('white').bgColor, 'bg-opacity-20'),
        borderColor: getColorClassNames(color, colorPalette.background).borderColor,
        ringColor: twMerge(getColorClassNames(color, colorPalette.ring).ringColor, 'ring-opacity-40'),
        hoverTextColor: getColorClassNames(color, colorPalette.text).hoverTextColor,
        hoverBgColor: twMerge(getColorClassNames(color, colorPalette.background).hoverBgColor, 'hover:bg-opacity-20'),
      };
  }
};
