import type { Message } from 'ai';
import { useEffect, useRef } from 'react';
import DotSpinner from '../../view/atom/dot-spinner';
import { MessageItem } from '../../view/atom/message-item';

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
      {messages.map((message) =>
        message.role === 'user' || message.role === 'assistant' ? (
          <MessageItem key={message.id} role={message.role} content={message.content} />
        ) : undefined,
      )}
      {isLoading ? <MessageItem role="assistant" content={<DotSpinner />} /> : null}
      <div ref={Chatref}></div>
    </div>
  );
}
