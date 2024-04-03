import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ReactNode } from 'react';

type ConversationCardRootProps = {
  children: ReactNode;
  defaultOpen: boolean;
};

export function ConversationCardRoot({ children, defaultOpen }: ConversationCardRootProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {children}
    </Collapsible.Root>
  );
}
