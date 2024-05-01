import React, { useEffect } from 'react';
import { useSubmit } from '../../hooks/use-submit.hooks';
import { Textarea } from '@tremor/react';
import TextAreaAutoSize from 'react-textarea-autosize';
import Tooltip from '../../atom/tooltip';
import IconButton from '../../atom/icons/icon-button';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { ChatRequestOptions } from 'ai';

type PromptFormProps = {
  value: string;
  disable?: boolean;
  formAction: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  onValueChange: (value: string) => void;
};

const PromptForm = ({ value, onValueChange, disable, formAction }: PromptFormProps) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const { formRef, onKeyDown } = useSubmit();

  return (
    <form
      className={`align-center flex w-96 justify-around rounded-md border border-gray-500 ${disable ? `bg-gray-100` : `bg-white`}`}
      ref={formRef}
      onSubmit={formAction}
    >
      <TextAreaAutoSize
        ref={textAreaRef}
        className=" bg flex w-11/12 resize-none border-none text-sm disabled:bg-gray-100"
        onChange={(e) => onValueChange(e.currentTarget.value)}
        placeholder="내용을 입력하세요"
        value={value}
        onKeyDown={onKeyDown}
        disabled={disable}
        minRows={2}
      />
      <Tooltip message="Send a message">
        <IconButton color="black" size="md" icon={PaperPlaneIcon} type="submit" disabled={disable} />
      </Tooltip>
    </form>
  );
};

export default PromptForm;
