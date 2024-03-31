import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/app/utils/style';

type ItemProps = {
  style?: React.CSSProperties;
  className?: string;
};

export const Item = forwardRef<HTMLDivElement, React.PropsWithChildren<ItemProps>>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div {...props} style={style} ref={ref} className={cn('py-1 pl-2', className)}>
        {children}
      </div>
    );
  },
);

Item.displayName = 'draggableItem';

type DraggableItemProps = {
  id: string;
  active: boolean;
  className?: string;
  disabled?: boolean;
};

export default function DraggableItem({
  id,
  active,
  className,
  disabled = false,
  children,
}: React.PropsWithChildren<DraggableItemProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      className={cn(
        'my-2 rounded-lg border  border-blue-200 bg-white',
        {
          'opacity-20': active,
        },
        className,
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </Item>
  );
}
