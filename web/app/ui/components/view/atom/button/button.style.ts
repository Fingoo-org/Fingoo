import { ButtonVariant, Color, Size, colorPalette, getColorClassNames } from '@/app/utils/style';
import { twMerge } from 'tailwind-merge';

export const Sizes: { [key: string]: Size } = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

export const ButtonVariants: { [key: string]: ButtonVariant } = {
  Primary: 'primary',
  Secondary: 'secondary',
  Light: 'light',
};

export const getButtonProportions = (variant: ButtonVariant) => {
  if (!(variant === 'light')) {
    return {
      xs: {
        paddingX: 'px-2.5',
        paddingY: 'py-1.5',
        fontSize: 'text-xs',
      },
      sm: {
        paddingX: 'px-4',
        paddingY: 'py-2',
        fontSize: 'text-sm',
      },
      md: {
        paddingX: 'px-4',
        paddingY: 'py-2',
        fontSize: 'text-md',
      },
      lg: {
        paddingX: 'px-4',
        paddingY: 'py-2.5',
        fontSize: 'text-lg',
      },
      xl: {
        paddingX: 'px-4',
        paddingY: 'py-3',
        fontSize: 'text-xl',
      },
    };
  }
  return {
    xs: {
      paddingX: '',
      paddingY: '',
      fontSize: 'text-xs',
    },
    sm: {
      paddingX: '',
      paddingY: '',
      fontSize: 'text-sm',
    },
    md: {
      paddingX: '',
      paddingY: '',
      fontSize: 'text-md',
    },
    lg: {
      paddingX: '',
      paddingY: '',
      fontSize: 'text-lg',
    },
    xl: {
      paddingX: '',
      paddingY: '',
      fontSize: 'text-xl',
    },
  };
};

export const getButtonColors = (variant: ButtonVariant, color: Color) => {
  switch (variant) {
    case 'primary':
      return {
        textColor: getColorClassNames('white').textColor,
        hoverTextColor: getColorClassNames('white').textColor,
        bgColor: getColorClassNames(color, colorPalette.background).bgColor,
        hoverBgColor: getColorClassNames(color, colorPalette.darkBackground).hoverBgColor,
        borderColor: getColorClassNames(color, colorPalette.border).borderColor,
        hoverBorderColor: getColorClassNames(color, colorPalette.darkBorder).hoverBorderColor,
      };
    case 'secondary':
      return {
        textColor: getColorClassNames(color, colorPalette.text).textColor,
        hoverTextColor: getColorClassNames(color, colorPalette.text).textColor,
        bgColor: getColorClassNames('transparent').bgColor,
        hoverBgColor: twMerge(
          getColorClassNames(color, colorPalette.background).hoverBgColor,
          'hover:bg-opacity-20 dark:hover:bg-opacity-20',
        ),
        borderColor: getColorClassNames(color, colorPalette.border).borderColor,
      };
    case 'light':
      return {
        textColor: getColorClassNames(color, colorPalette.text).textColor,
        hoverTextColor: getColorClassNames(color, colorPalette.darkText).hoverTextColor,
        bgColor: getColorClassNames('transparent').bgColor,
        borderColor: '',
        hoverBorderColor: '',
      };
  }
};
