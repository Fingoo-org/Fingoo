'use client';
import { ChatRequestOptions } from 'ai';
import ChatCard from '../view/molecule/chat-card';
import PromptForm from '../view/molecule/prompt-form/prompt-form';
import { useFingooChat } from '@/app/business/hooks/linguistic-guidance/use-fingoo-chat.hook';
import { useLogger } from '@/app/logging/logging-context';

export default function Chat() {
  const logger = useLogger();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useFingooChat();

  const handlePromptSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => {
    logger.track('submit_gpt_form', { message: input });
    handleSubmit(e, chatRequestOptions);
  };

  return (
    <div className="2lg:px-10 px-6">
      <ChatCard defaultOpen={true}>
        <ChatCard.Header title="Asking GPT" />
        <ChatCard.Content isLoading={isLoading} messages={messages} />
      </ChatCard>
      <div className="pt-2">
        <PromptForm value={input} onValueChange={handleInputChange} formAction={handlePromptSubmit} />
      </div>
    </div>
  );
}
