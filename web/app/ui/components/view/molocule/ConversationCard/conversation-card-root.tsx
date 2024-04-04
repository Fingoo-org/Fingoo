import { ReactNode } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

type ConversationCardProps = {
  defaultOpen: boolean;
  children: ReactNode;
};

export const ConversationCardRoot = ({ defaultOpen, children }: ConversationCardProps) => {
  return <Collapsible.Root defaultOpen={defaultOpen}>{children}</Collapsible.Root>;
};
