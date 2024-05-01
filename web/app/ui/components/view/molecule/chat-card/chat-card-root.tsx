import { ReactNode } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/app/utils/style';

type ChatCardProps = {
  defaultOpen: boolean;
  children: ReactNode;
  className?: string;
};

export const ChatCardRoot = ({ defaultOpen, className, children }: ChatCardProps) => {
  return (
    <Collapsible.Root className={cn('flex h-full flex-col', className)} defaultOpen={defaultOpen}>
      {children}
    </Collapsible.Root>
  );
};
