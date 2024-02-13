import clsx from 'clsx';
import React from 'react';

type NativeDivType = Omit<React.ComponentPropsWithoutRef<'div'>, 'onInput'>;

type EditableTextProps = {
  text: string;
  readonly?: boolean;
  onChange?: (text: string) => void;
} & NativeDivType;

export default function EditableText({ text, readonly = false, onChange, className }: EditableTextProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event.target.value);

    if (onChange) {
      onChange(event.target.value);
    }
  };
  console.log(text);

  return (
    <div className={'inline-block relative group'}>
      <div
        className="before:w-0 before:h-[1px] before:absolute before:z-10 before:opacity-0 before:bg-black before:bottom-0 before:right-1/2 before:ease-in before:duration-200 
        group-hover:before:w-1/2 group-hover:before:opacity-100 has-[:focus]:before:w-1/2 has-[:focus]:before:opacity-100 has-[:focus]:has-[:read-only]:before:w-0
        has-[:hover]:has-[:read-only]:before:w-0 after:w-0 after:h-[1px] after:absolute after:z-10 after:opacity-0 after:bg-black after:bottom-0 after:left-1/2 after:ease-in after:duration-200 group-hover:after:w-1/2 group-hover:after:opacity-100 has-[:focus]:after:w-1/2 has-[:focus]:after:opacity-100 
        has-[:focus]:has-[:read-only]:after:w-0 has-[:hover]:has-[:read-only]:after:w-0"
      >
        <input
          readOnly={readonly}
          key={text}
          defaultValue={text}
          onChange={handleChange}
          className={clsx('focus:outline-none border-0 focus:ring-0 focus:ring-offset-0', className)}
        />
      </div>
    </div>
  );
}
