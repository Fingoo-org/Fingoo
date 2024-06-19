import { TextInput } from '@tremor/react';
import { ChatRequestOptions } from 'ai';
import { useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Chip } from '../../view/atom/chip';

const PREDICT_PROMPTS = ['S&P500 예측해줘', '애플 주식 예측해줘', '엔비디아 예측해줘'];

const ANALYZE_PROMPTS = ['미국 반도체 시장 분석해줘', '경제 현황 분석해줘'];

const RECOMMEND_PROMPTS = ['미국 반도체 주식 추천해줘'];
// '미국 은행 관련 주식 추천해줘',
const EXPLANATION_PROMPTS = ['AMZN에 대해 설명해줘', 'S&P 500에 대해 설명해줘'];

const PROMPTS = [PREDICT_PROMPTS, ANALYZE_PROMPTS, RECOMMEND_PROMPTS, EXPLANATION_PROMPTS];

function getRandomPrompt(prompts: string[]) {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function getPrompts() {
  return PROMPTS.map((prompts) => getRandomPrompt(prompts));
}

type PromptPresetProps = {
  value: string;
  setInput: (value: string) => void;
  formAction: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
};

export default function PromptPreset({ value, setInput, formAction }: PromptPresetProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (prompt: string) => {
    flushSync(() => {
      setInput(prompt);
    });

    formRef.current?.requestSubmit();
  };

  const prompts = useMemo(() => getPrompts(), []);

  return (
    <div className="flex flex-wrap gap-2 px-6	">
      {prompts.map((prompt) => (
        <Chip onClick={handleClick} key={prompt} text={prompt} />
      ))}
      <form className="invisible h-0 w-0" ref={formRef} onSubmit={formAction}>
        <TextInput className="h-0 w-0" ref={inputRef} value={value} disabled={true} />
      </form>
    </div>
  );
}
