import { Sizes, wrapperProportions, iconSizes, IconVariants, getIconColors, shape } from './icon-button.style';
import { Color, Size, IconVariant } from '@/app/utils/style';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type IconButtonProps = {
  icon: React.ElementType;
  onClick?: NativeButtonType['onClick'];
  size?: Size;
  color: Color;
  invariant?: IconVariant;
};

export default React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, onClick, size = Sizes.SM, invariant = IconVariants.Simple, color },
  ref,
) {
  const Icon = icon;

  const iconShapeStyles = shape[invariant];
  const iconColorStyles = getIconColors(invariant, color);
  return (
    <button
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
      )}
    >
      <Icon className={twMerge(iconSizes[size].height, iconSizes[size].width)} />
    </button>
  );
});
