import { Sizes, wrapperProportions, iconSizes, IconVariants, getIconColors, shape } from './icon-button.style';
import { Color, Size, IconVariant } from '@/app/utils/style';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type IconProps = {
  icon: React.ElementType;
  size?: Size;
  color?: Color;
  variant?: IconVariant;
};

export default function Icon({ icon, size = Sizes.SM, variant = IconVariants.Simple, color = 'blue' }: IconProps) {
  const Icon = icon;

  const iconShapeStyles = shape[variant];
  const iconColorStyles = getIconColors(variant, color);
  return (
    <div
      className={twMerge(
        wrapperProportions[size].paddingX,
        wrapperProportions[size].paddingY,
        iconColorStyles?.bgColor,
        iconColorStyles?.borderColor,
        iconColorStyles?.ringColor,
        iconColorStyles?.textColor,
        iconColorStyles?.hoverBgColor,
        iconColorStyles?.hoverTextColor,
        iconShapeStyles?.border,
        iconShapeStyles?.ring,
        iconShapeStyles?.rounded,
        iconShapeStyles?.shadow,
      )}
    >
      <Icon className={twMerge(iconSizes[size].height, iconSizes[size].width)} />
    </div>
  );
}
