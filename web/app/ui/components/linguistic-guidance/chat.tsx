'use client';
import ChatCard from '../view/molecule/chat-card';
import { useChat } from 'ai/react';
import PromptForm from '../view/molecule/prompt-form/prompt-form';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="2lg:px-10 px-6">
      <ChatCard defaultOpen={true}>
        <ChatCard.Header title="Asking GPT" />
        <ChatCard.Content isLoading={isLoading} messages={messages} />
      </ChatCard>
      <div className="pt-2">
        <PromptForm value={input} onValueChange={handleInputChange} formAction={handleSubmit} />
      </div>
    </div>
  );
}
