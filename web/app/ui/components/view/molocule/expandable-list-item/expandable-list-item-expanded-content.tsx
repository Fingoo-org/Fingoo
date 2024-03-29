import { cn } from '@/app/utils/style';
import React from 'react';

interface ExpandableListItemExpandedContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ExpandableListItemExpandedContent({
  className,
  children,
  ...props
}: ExpandableListItemExpandedContentProps) {
  return (
    <div className={cn('bg-white', className)} {...props}>
      {children}
    </div>
  );
}
