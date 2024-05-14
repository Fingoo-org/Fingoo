import React, { useEffect, useRef } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { MessageItem } from '../../atom/message-item';
import type { Message } from 'ai';
import DotSpinner from '../../atom/dot-spinner';

type ChatCardProps = {
  messages?: Message[];
  isLoading?: boolean;
};
const ChatCardContent = ({ messages = [], isLoading }: ChatCardProps) => {
  const Chatref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Chatref.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  return (
    <Collapsible.Content className="h-[35vh] overflow-y-auto	rounded-b-xl border border-fingoo-gray-3 bg-white">
      <div className="space-y-3 p-3">
        {messages.map((message) =>
          message.role === 'user' || message.role === 'assistant' ? (
            <MessageItem key={message.id} role={message.role} content={message.content} />
          ) : undefined,
        )}
        {isLoading ? <MessageItem role="assistant" content={<DotSpinner />} /> : null}
        <div ref={Chatref}></div>
      </div>
    </Collapsible.Content>
  );
};

export default ChatCardContent;
