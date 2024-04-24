import React, { useState, useEffect } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Message, MessageProps } from '../../atom/message';

type ConverationCardProps = {
  initContent?: MessageProps[];
};
const ConversationCardContent = ({ initContent = [] }: ConverationCardProps) => {
  const [messages, setMessages] = useState<MessageProps[]>(initContent);

  useEffect(() => {
    setMessages(initContent);
  }, [initContent]);

  return (
    <Collapsible.Content className=" h-96 overflow-scroll rounded-b-xl border bg-white">
      <div className="space-y-3 p-3">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </div>
    </Collapsible.Content>
  );
};

export default ConversationCardContent;
