import { Sizes, IconVariants } from './icon-button.style';
import { Color, Size, IconVariant, cn } from '@/app/utils/style';
import React from 'react';
import Icon from './variant-icon';
import { getButtonColors } from '../button/button.style';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type IconButtonProps = {
  icon: React.ElementType;
  size?: Size;
  color?: Color;
  variant?: IconVariant;
  disabled?: boolean;
} & NativeButtonType;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, onClick, size = Sizes.SM, variant = IconVariants.Simple, color = 'blue', disabled, className, ...props },
  ref,
) {
  const buttonColorStyle = getButtonColors('light', color);
  return (
    <button
      className={cn(
        'rounded-md border-0 outline-none ring-0',
        buttonColorStyle.bgColor,
        buttonColorStyle.hoverBgColor,
        className,
      )}
      {...props}
      disabled={disabled}
      ref={ref}
      onClick={onClick}
    >
      <Icon icon={icon} size={size} variant={variant} color={color} />
    </button>
  );
});

export default IconButton;
