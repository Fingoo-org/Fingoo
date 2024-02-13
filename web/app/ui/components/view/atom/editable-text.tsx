import clsx from 'clsx';
import React from 'react';

type NativeDivType = Omit<React.ComponentPropsWithoutRef<'div'>, 'onInput'>;

type EditableTextProps = {
  text: string;
  readonly?: boolean;
} & NativeDivType;

// Refactor: 재사용 가능하도록 리팩토링 필요
export default function EditableText({ text, readonly = false, className }: EditableTextProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event.target.value);
  };

  return (
    <div className={clsx('inline-block relative group ', className)}>
      <div
        className="before:w-0 before:h-[1px] before:absolute before:z-10 before:opacity-0 before:bg-black before:bottom-0 before:right-1/2 before:ease-in before:duration-200 
        group-hover:before:w-16 group-hover:before:opacity-100 has-[:focus]:before:w-16 has-[:focus]:before:opacity-100 has-[:focus]:has-[:read-only]:before:w-0
        has-[:hover]:has-[:read-only]:before:w-0 after:w-0 after:h-[1px] after:absolute after:z-10 after:opacity-0 after:bg-black after:bottom-0 after:left-1/2 after:ease-in after:duration-200 group-hover:after:w-16 group-hover:after:opacity-100 has-[:focus]:after:w-16 has-[:focus]:after:opacity-100 
        has-[:focus]:has-[:read-only]:after:w-0 has-[:hover]:has-[:read-only]:after:w-0"
      >
        <input
          readOnly={readonly}
          value={text}
          onChange={handleChange}
          className="w-full focus:outline-none border-0 focus:ring-0 focus:ring-offset-0"
        />
      </div>
    </div>
  );
}
