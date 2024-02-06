import { Sizes, wrapperProportions, iconSizes, IconVariants, getIconColors, shape } from './icon-button.style';
import { Color, Size, IconVariant } from '@/app/utils/style';
import { twMerge } from 'tailwind-merge';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type IconButtonProps = {
  icon: React.ElementType;
  onClick?: NativeButtonType['onClick'];
  size?: Size;
  color: Color;
  invariant?: IconVariant;
};

export default function IconButton({
  icon,
  onClick,
  size = Sizes.SM,
  invariant = IconVariants.Simple,
  color,
}: IconButtonProps) {
  const Icon = icon;

  const iconShapeStyles = shape[invariant];
  const iconColorStyles = getIconColors(invariant, color);
  return (
    <button
      onClick={onClick}
      className={twMerge(
        wrapperProportions[size].paddingX,
        wrapperProportions[size].paddingY,
        iconColorStyles?.bgColor,
        iconColorStyles?.borderColor,
        iconColorStyles?.ringColor,
        iconColorStyles?.textColor,
        iconShapeStyles?.border,
        iconShapeStyles?.ring,
        iconShapeStyles?.rounded,
        iconShapeStyles?.shadow,
      )}
    >
      <Icon className={twMerge(iconSizes[size].height, iconSizes[size].width)} />
    </button>
  );
}
