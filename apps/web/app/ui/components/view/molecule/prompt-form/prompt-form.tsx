import React, { useEffect } from 'react';
import { useSubmit } from '../../../../../utils/hooks/use-submit.hooks';
import TextAreaAutoSize from 'react-textarea-autosize';
import IconButton from '../../atom/icons/icon-button';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { ChatRequestOptions } from 'ai';
import { cn } from '@/app/utils/style';
import { TextInput } from '@tremor/react';

type PromptFormProps = {
  value: string;
  disable?: boolean;
  formAction: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const PromptForm = ({ value, onValueChange, disable, formAction }: PromptFormProps) => {
  const textAreaRef = React.useRef<HTMLInputElement>(null);
  const { formRef, onKeyDown } = useSubmit();

  return (
    <form
      className={cn(
        'flex w-full items-center justify-around rounded-lg border border-fingoo-gray-3',
        {
          'bg-gray-100': disable,
          'bg-white': !disable,
        },
        'has-[:focus]:ring-2',
        'has-[:focus]:border-fingoo-main has-[:focus]:ring-fingoo-sub',
      )}
      ref={formRef}
      onSubmit={formAction}
    >
      <TextInput
        ref={textAreaRef}
        className="flex w-11/12 resize-none rounded-lg border-0 text-sm outline-none ring-0 hover:bg-white focus:border-0 focus:bg-white focus:outline-none focus:ring-0 disabled:bg-gray-100"
        onChange={onValueChange}
        placeholder="내용을 입력하세요"
        value={value}
        // onKeyDown={onKeyDown}
        disabled={disable}
      />
      <IconButton color="black" size="md" icon={PaperPlaneIcon} type="submit" disabled={disable} />
    </form>
  );
};

export default PromptForm;
