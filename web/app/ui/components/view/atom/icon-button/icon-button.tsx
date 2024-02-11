import { Sizes, wrapperProportions, iconSizes, IconVariants, getIconColors, shape } from './icon-button.style';
import { Color, Size, IconVariant } from '@/app/utils/style';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type IconButtonProps = {
  icon: React.ElementType;
  size?: Size;
  color: Color;
  variant?: IconVariant;
} & NativeButtonType;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, onClick, size = Sizes.SM, variant = IconVariants.Simple, color, className, ...props },
  ref,
) {
  const Icon = icon;

  const iconShapeStyles = shape[variant];
  const iconColorStyles = getIconColors(variant, color);
  return (
    <button
      {...props}
      ref={ref}
      onClick={onClick}
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
        className,
      )}
    >
      <Icon className={twMerge(iconSizes[size].height, iconSizes[size].width)} />
    </button>
  );
});

export default IconButton;
