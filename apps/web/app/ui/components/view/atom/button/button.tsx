import { ButtonVariant, Size, Color, cn } from '@/app/utils/style';
import React from 'react';
import { getButtonColors, getButtonProportions, Sizes, ButtonVariants } from './button.style';
import { iconSizes } from '../icons/icon-button.style';
import { Loader2 } from 'lucide-react';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type ButtonProps = {
  size?: Size;
  color?: Color;
  variant?: ButtonVariant;
  isLoading?: boolean;
  borderRadius?: string;
  shadow?: string;
} & NativeButtonType;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    size = Sizes.SM,
    color = 'blue',
    variant = ButtonVariants.Primary,
    className,
    disabled,
    isLoading,
    borderRadius = 'rounded-lg',
    shadow = '',
    ...props
  }: ButtonProps,
  ref,
) {
  const buttonShapeStyles = variant !== ButtonVariants.Light ? `border ${borderRadius}` : borderRadius;
  const buttonProportionsStyle = getButtonProportions(variant);
  const buttonColorStyle = getButtonColors(variant, color);

  return (
    <button
      disabled={disabled}
      {...props}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center',
        disabled && 'cursor-not-allowed opacity-50',
        buttonShapeStyles,
        shadow,
        buttonProportionsStyle[size].paddingX,
        buttonProportionsStyle[size].paddingY,
        buttonProportionsStyle[size].fontSize,
        buttonColorStyle.textColor,
        buttonColorStyle.bgColor,
        buttonColorStyle.borderColor,
        buttonColorStyle.hoverBgColor,
        buttonColorStyle.hoverTextColor,
        className,
      )}
    >
      {isLoading ? (
        <Loader2 className={cn('mr-1 animate-spin', iconSizes[size].height, iconSizes[size].width)} />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
