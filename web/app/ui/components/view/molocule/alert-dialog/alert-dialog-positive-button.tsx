import React from 'react';

type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;

type AlertDialogPositiveButtonProps = {} & NativeButtonType;

export function AlertDialogPositiveButton({
  children,
  ...props
}: React.PropsWithChildren<AlertDialogPositiveButtonProps>) {
  // Refactor: 버튼 디자인 시스템화
  return (
    <button
      {...props}
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}
