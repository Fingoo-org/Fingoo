'use client';
import ChatCard from '../view/molecule/chat-card';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <ChatCard defaultOpen={true}>
      <ChatCard.Header title="short chat" />
      <ChatCard.Content messages={messages} />
    </ChatCard>
  );
}
