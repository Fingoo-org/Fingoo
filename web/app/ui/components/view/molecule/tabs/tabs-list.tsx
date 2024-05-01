import { cn } from '@/app/utils/style';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-fingoo-gray-1.5 p-1 text-fingoo-gray-5 dark:bg-slate-800 dark:text-slate-400',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;
