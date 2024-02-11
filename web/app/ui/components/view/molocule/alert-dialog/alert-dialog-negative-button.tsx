import React from 'react';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type AlertDialogNegativeButtonProps = {} & NativeButtonType;

export function AlertDialogNegativeButton({
  children,
  ...props
}: React.PropsWithChildren<AlertDialogNegativeButtonProps>) {
  // Refactor: 버튼 디자인 시스템화
  return (
    <button
      {...props}
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
