import type { Message } from 'ai';
import { useEffect, useRef } from 'react';
import DotSpinner from '../../view/atom/dot-spinner';
import { MessageItem } from '../../view/atom/message-item';
import { ToolGuide } from './tool-guide';
import { FunctionName } from '@/app/business/services/linguistic-guidance/tools-schema.service';

type MessagesProps = {
  messages?: Message[];
  isLoading?: boolean;
};
export function Messages({ messages = [], isLoading }: MessagesProps) {
  const Chatref = useRef<HTMLDivElement | null>(null);

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    Chatref.current?.scrollIntoView({ behavior: 'auto' });
  }, [lastMessageContent]);

  return (
    <div className="flex h-full flex-col justify-end space-y-5  p-3">
      {messages.map((message) => {
        if (message.role === 'assistant' && Array.isArray(message.tool_calls)) {
          const tool_name = message.tool_calls[0].function.name;
          return <ToolGuide key={message.id} tool_name={tool_name as FunctionName} />;
        }

        return message.role === 'user' || message.role === 'assistant' ? (
          <MessageItem key={message.id} role={message.role} content={message.content} />
        ) : undefined;
      })}
      {isLoading ? <MessageItem role="assistant" content={<DotSpinner />} /> : null}
      <div ref={Chatref}></div>
    </div>
  );
}
