import React, { MouseEventHandler } from 'react';
import { clsx } from 'clsx';
import { cn } from '@/app/utils/style';

type SelectableListItemProps = {
  selected: boolean;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  onSelect: () => void;
  onDeSelect?: () => void;
};

export default function SelectableItem({
  children,
  selected,
  style,
  disabled,
  className,
  onSelect,
  onDeSelect,
}: React.PropsWithChildren<SelectableListItemProps>) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => (selected ? onDeSelect?.() : onSelect());
  return (
    <button
      className={cn(
        'h-full w-full bg-white px-4 py-2 ring-1 ring-fingoo-sub',
        ' hover:opacity-60',
        disabled && 'cursor-not-allowed opacity-50',
        {
          'bg-fingoo-main text-white': selected,
        },
        className,
      )}
      disabled={disabled}
      role="tab"
      aria-selected={`${selected}`}
      onClick={handleClick}
      style={style}
    >
      <div className="h-full w-full font-semibold ">{children}</div>
    </button>
  );
}
