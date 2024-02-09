type DialogMenuItemProps = {
  icon: React.ElementType;
};

export function DialogMenuItem({ children, icon }: React.PropsWithChildren<DialogMenuItemProps>) {
  // Refactor: 부모의 onclose를 받도록 context 설정
  const Icon = icon;

  return (
    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white">
      <Icon className="w-5 h-5 mr-2 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}
