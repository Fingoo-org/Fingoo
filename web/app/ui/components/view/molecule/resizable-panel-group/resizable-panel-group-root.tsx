import { cn } from '@/app/utils/style';
import * as ResizablePrimitive from 'react-resizable-panels';

export const ResizablePanelGroupRoot = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...props}
  />
);
