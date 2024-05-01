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
    <Collapsible.Content className="grow rounded-b-xl border bg-white">
      <div className="space-y-3 p-3">
        {messages.map((message) => (
          <MessageItem key={message.id} role={message.role} content={message.content} />
        ))}
        {isLoading ? <MessageItem role="assistant" content={<DotSpinner />} /> : null}
        <div ref={Chatref}></div>
      </div>
    </Collapsible.Content>
  );
};

export default ChatCardContent;
