import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@tremor/react';
import { cn } from '@/app/utils/style';

type Handle = 'top';

type DraggableProps = {
  id: string;
  active?: boolean;
  disabled?: boolean;
  handle?: Handle;
};

export default function Draggable({
  id,
  disabled = false,
  handle = 'top',
  active,
  children,
}: React.PropsWithChildren<DraggableProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn('w-full', {
        'opacity-60': active,
      })}
      ref={setNodeRef}
      style={style}
    >
      <div className="relative">
        {handle === 'top' && (
          <div className="absolute left-1/2 top-1 z-10 -translate-x-1/2 cursor-grab">
            <Button {...attributes} {...listeners} variant={'light'}>
              <GripHorizontalIcon className="h-4 w-6" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function GripHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="9" r="1" />
      <circle cx="19" cy="9" r="1" />
      <circle cx="5" cy="9" r="1" />
      <circle cx="12" cy="15" r="1" />
      <circle cx="19" cy="15" r="1" />
      <circle cx="5" cy="15" r="1" />
    </svg>
  );
}
