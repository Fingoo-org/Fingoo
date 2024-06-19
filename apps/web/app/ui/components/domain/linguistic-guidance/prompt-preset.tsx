import { TextInput } from '@tremor/react';
import { ChatRequestOptions } from 'ai';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

const PROMPTS = ['S&P 500 예측해줘'];

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

  return (
    <div className="flex flex-wrap gap-2 px-6	">
      {PROMPTS.map((prompt) => (
        <Chip onClick={handleClick} key={prompt} text={prompt} />
      ))}
      <form className="invisible h-0 w-0" ref={formRef} onSubmit={formAction}>
        <TextInput className="h-0 w-0" ref={inputRef} value={value} disabled={true} />
      </form>
    </div>
  );
}

type ChipProps = {
  text: string;
  value?: string;
  onClick?: (text: string) => void;
};

function Chip({ text, value, onClick }: ChipProps) {
  const handleClick = () => {
    onClick?.(value ?? text);
  };

  return (
    <button
      onClick={handleClick}
      className="flex animate-pulse  items-center rounded-md bg-fingoo-gray-1.5 px-4 py-2 text-xs font-bold"
    >
      <p>{text}</p>
    </button>
  );
}
