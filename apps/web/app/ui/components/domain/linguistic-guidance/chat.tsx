'use client';
import { ChatRequestOptions } from 'ai';
import PromptForm from '../../view/molecule/prompt-form/prompt-form';
import { useLogger } from '@/app/logging/use-logger.hook';
import type { Message } from 'ai';
import { Messages } from '../../view/molecule/messages';
import PromptPreset from './prompt-preset';
import { useChat } from '@/app/business/hooks/linguistic-guidance/use-chat.hook';

const defaultMessages: Message = {
  id: 'custom',
  content: '안녕? 나는 너희들의 친구 Fingoo라고 해. 무엇을 도와줄까?',
  role: 'assistant',
};

const MockMessages: Message[] = [
  {
    id: '1',
    content:
      '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
    role: 'user',
  },
  {
    id: '2',
    content: '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
    role: 'assistant',
  },
  {
    id: '3',
    content:
      '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
    role: 'user',
  },
  {
    id: '4',
    content: '안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요안녕하세요',
    role: 'assistant',
  },
  {
    id: '5',
    content: '안녕하세요',
    role: 'user',
  },
  {
    id: '6',
    content: '안녕하세요',
    role: 'assistant',
  },
  {
    id: '7',
    content: '안녕하세요',
    role: 'assistant',
  },
];

export default function Chat() {
  const logger = useLogger();
  const { messages, input, handleInputChange, setInput, handleSubmit, isLoading } = useChat();

  const handlePromptSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined,
  ) => {
    logger.track('submit_gpt_form', { message: input });
    handleSubmit(e, chatRequestOptions);
  };

  const messagesWithGreeting = [defaultMessages, ...messages];

  return (
    <div className="flex h-full items-end">
      <div className="w-full">
        <div className="max-h-[73vh] overflow-y-auto px-6 scrollbar-thin">
          <Messages messages={messagesWithGreeting} isLoading={isLoading} />
        </div>
        <PromptPreset value={input} formAction={handlePromptSubmit} setInput={setInput} />
        <div className="px-6 pb-4 pt-6">
          <PromptForm value={input} onValueChange={handleInputChange} formAction={handlePromptSubmit} />
        </div>
      </div>
    </div>
  );
}
