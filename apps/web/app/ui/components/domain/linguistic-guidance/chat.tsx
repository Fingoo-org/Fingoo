'use client';
import { ChatRequestOptions } from 'ai';
import PromptForm from '../../view/molecule/prompt-form/prompt-form';
import { useFingooChat } from '@/app/business/hooks/linguistic-guidance/use-fingoo-chat.hook';
import { useLogger } from '@/app/logging/logging-context';
import type { Message } from 'ai';
import { Messages } from '../../view/molecule/messages';
import PromptPreset from './prompt-preset';

const mockMessage: Message[] = [
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'user',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'assistant',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'user',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'assistant',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'assistant',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'assistant',
  },
  {
    id: '1',
    content:
      '미국 증시(S$P500)를 예측하기 위한 중요 지표는 다음과 같습니다. US10Y(미국 10년물 금리) WALCL(연준의 자산규모) CPIAUCSL(소비자물가상승지수) 위 지표들을 반영한 예측지표 결과는 오른쪽 차트에서 확인바랍니다.',
    role: 'assistant',
  },
];

const defaultMessages: Message = {
  id: 'custom',
  content: '안녕? 나는 너희들의 친구 Fingoo라고 해. 무엇을 도와줄까?',
  role: 'assistant',
};

export default function Chat() {
  const logger = useLogger();
  const { messages, input, handleInputChange, setInput, handleSubmit, isLoading } = useFingooChat();

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
      <div className=" w-full">
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
