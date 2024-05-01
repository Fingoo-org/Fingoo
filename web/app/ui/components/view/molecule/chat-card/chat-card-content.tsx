import React, { useState, useEffect, useRef } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Message, MessageProps } from '../../atom/message';

type ChatCardProps = {
  initContent?: MessageProps[];
};
const ChatCardContent = ({ initContent = [] }: ChatCardProps) => {
  const Chatref = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>(initContent);

  useEffect(() => {
    setMessages(initContent);
    Chatref.current?.scrollIntoView({ behavior: 'auto' });
  }, [initContent]);

  return (
    <Collapsible.Content className="grow overflow-scroll rounded-b-xl border bg-white">
      <div className="space-y-3 p-3">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} isLoading={message.isLoading} />
        ))}
        <div ref={Chatref}></div>
      </div>
    </Collapsible.Content>
  );
};

export default ChatCardContent;
