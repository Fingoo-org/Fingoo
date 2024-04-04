import React, { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import ConversationCardHeader from './conversation-card-header';
import ConversationCardContent from './conversation-card-content';

type ConversationCardProps = {
  defaultOpen: boolean;
  title: string;
  infoIcon?: React.ElementType;
  collapsibleIcon?: React.ElementType;
  initContent?: string[];
};

export const ConversationCardRoot = ({
  defaultOpen,
  title,
  infoIcon,
  collapsibleIcon,
  initContent,
}: ConversationCardProps) => {
  return (
    <Collapsible.Root defaultOpen={defaultOpen}>
      <ConversationCardHeader title={title} infoIcon={infoIcon} collapsibleIcon={collapsibleIcon} />
      <ConversationCardContent initContent={initContent} />
    </Collapsible.Root>
  );
};
