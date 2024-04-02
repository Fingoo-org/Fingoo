import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ReactNode } from 'react';

type CardRootProps = {
  children: ReactNode;
  defaultOpen: boolean;
};

export function CardRoot({ children, defaultOpen }: CardRootProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {children}
    </Collapsible.Root>
  );
}
