import React from 'react';

type EditableTextProps = {};

// Refactor: 재사용 가능하도록 리팩토링 필요
export default function EditableText({ children }: React.PropsWithChildren<EditableTextProps>) {
  return (
    <div className="inline-block relative group">
      <div className="after:w-0 after:h-[1px] after:absolute after:z-10 after:opacity-0 after:bg-black after:bottom-0 after:left-1/2 after:ease-in after:duration-200 group-hover:after:w-16 group-hover:after:opacity-100 has-[:focus]:after:w-16 has-[:focus]:after:opacity-100">
        <div className="before:w-0 before:h-[1px] before:absolute before:z-10 before:opacity-0 before:bg-black before:bottom-0 before:right-1/2 before:ease-in before:duration-200 group-hover:before:w-16 group-hover:before:opacity-100 has-[:focus]:before:w-16 has-[:focus]:before:opacity-100">
          <div className="w-32 h-7 overflow-hidden cursor-text">
            <div className="whitespace-nowrap overflow-x-auto outline-none min-h-full " contentEditable={true}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
