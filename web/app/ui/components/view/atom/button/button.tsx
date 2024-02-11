import { ButtonVariant, Size, Color } from '@/app/utils/style';
import React from 'react';
import { getButtonColors, getButtonProportions, Sizes, ButtonVariants } from './button.style';
import { twMerge } from 'tailwind-merge';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type ButtonProps = {
  size?: Size;
  color: Color;
  variant?: ButtonVariant;
} & NativeButtonType;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, size = Sizes.SM, color, variant = ButtonVariants.Primary, className, ...props }: ButtonProps,
  ref,
) {
  const buttonShapeStyles = variant !== ButtonVariants.Light ? 'rounded-lg border' : '';
  const buttonProportionsStyle = getButtonProportions(variant);
  const buttonColorStyle = getButtonColors(variant, color);

  return (
    <button
      {...props}
      ref={ref}
      className={twMerge(
        buttonShapeStyles,
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
      {children}
    </button>
  );
});

export default Button;
