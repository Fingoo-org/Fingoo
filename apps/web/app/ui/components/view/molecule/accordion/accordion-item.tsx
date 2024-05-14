import { cn } from '@/app/utils/style';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn('', className)} {...props} />);
AccordionItem.displayName = 'AccordionItem';
