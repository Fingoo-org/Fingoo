'use client';
import ChatCard from '../view/molecule/chat-card';
import { useChat } from 'ai/react';
import PromptForm from '../view/molecule/prompt-form/prompt-form';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <ChatCard defaultOpen={true} className="2lg:px-10 px-6">
      <ChatCard.Header title="Asking GPT" />
      <ChatCard.Content isLoading={isLoading} messages={messages} />
      <div className="pt-5">
        <PromptForm value={input} onValueChange={handleInputChange} formAction={handleSubmit} />
      </div>
    </ChatCard>
  );
}
