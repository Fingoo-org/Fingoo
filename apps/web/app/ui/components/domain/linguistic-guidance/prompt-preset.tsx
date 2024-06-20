import { TextInput } from '@tremor/react';
import { ChatRequestOptions } from 'ai';
import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Chip } from '../../view/atom/chip';
import IconButton from '../../view/atom/icons/icon-button';
import { RefreshIcon } from '@heroicons/react/solid';

const PREDICT_PROMPTS = ['S&P500 예측해줘', '애플 주식 예측해줘', '미국환율 예측해줘'];

const ANALYZE_PROMPTS = ['미국 반도체 시장 분석해줘', '에너지 시장 분석해줘', '헬스케어 시장 분석해줘'];

const RECOMMEND_PROMPTS = ['미국 반도체 주식 추천해줘', '미국 IT 주식 추천해줘', '헬스케어 관련 주식 추천해줘'];
// '미국 은행 관련 주식 추천해줘',
const EXPLANATION_PROMPTS = [
  'AMZN에 대해 설명해줘',
  '비트코인에 대해 설명해줘',
  '암드는 뭐하는 회사야?',
  '퀄컴이 뭐하는 회사야?',
  '비트코인에 대해 설명해줘',
];

const PROMPTS = [PREDICT_PROMPTS, ANALYZE_PROMPTS, RECOMMEND_PROMPTS, EXPLANATION_PROMPTS];

function getRandomPrompt(prompts: string[]) {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function getPrompts() {
  return PROMPTS.map((prompts) => getRandomPrompt(prompts));
}

function getSeed() {
  return Math.round(Math.random() * 1000);
}

type PromptPresetProps = {
  value: string;
  setInput: (value: string) => void;
  formAction: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
};

export default function PromptPreset({ value, setInput, formAction }: PromptPresetProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [randomSeed, setRandomSeed] = useState(getSeed);

  const handleClick = (prompt: string) => {
    flushSync(() => {
      setInput(prompt);
    });

    formRef.current?.requestSubmit();
  };

  const prompts = useMemo(() => getPrompts(), [randomSeed]);

  const handleReset = () => {
    setRandomSeed(getSeed());
  };

  return (
    <div className="flex flex-wrap gap-2 px-6	">
      <IconButton
        onClick={handleReset}
        icon={RefreshIcon}
        variant={'simple'}
        color={'gray'}
        className="rounded-full hover:animate-spin"
      />
      {prompts.map((prompt) => (
        <Chip onClick={handleClick} key={prompt} text={prompt} />
      ))}
      <form className="invisible h-0 w-0" ref={formRef} onSubmit={formAction}>
        <TextInput className="h-0 w-0" ref={inputRef} value={value} disabled={true} />
      </form>
    </div>
  );
}
