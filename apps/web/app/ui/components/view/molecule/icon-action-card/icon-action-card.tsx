import React from 'react';
import { cn } from '@/app/utils/style';
import IconButton from '../../atom/icons/icon-button';
import { Color, Size, IconVariant } from '@/app/utils/style';

interface IconActionCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon: React.ElementType;
  iconColor?: Color;
  iconSize?: Size;
  iconVariant?: IconVariant;
}

const IconActionCard = React.forwardRef<HTMLButtonElement, IconActionCardProps>(
  ({ className, text, icon, iconColor = 'gray', iconSize = 'sm', iconVariant = 'simple', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'flex w-full items-center justify-between px-4 py-3',
          'rounded-xl bg-white',
          'hover:bg-slate-50',
          className,
        )}
        {...props}
      >
        <span className="mr-20 text-[15px] font-bold">{text}</span>
        <IconButton icon={icon} color={iconColor} size={iconSize} variant={iconVariant} />
      </button>
    );
  },
);

IconActionCard.displayName = 'IconActionCard';

export default IconActionCard;
