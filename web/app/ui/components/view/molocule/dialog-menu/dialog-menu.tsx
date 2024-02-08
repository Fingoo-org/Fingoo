import { DotsHorizontalIcon } from '@heroicons/react/solid';

export default function DialogMenu() {
  return (
    <div className="fixed top-16 w-56">
      <div
        role="dialog"
        className="relative bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto w-32 mt-2 origin-top-left ring-1 ring-black/5 focus:outline-none"
      >
        <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
        <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
        <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
        <DialogMenuItem icon={DotsHorizontalIcon}>Edit</DialogMenuItem>
      </div>
    </div>
  );
}

type DialogMenuItemProps = {
  icon: React.ElementType;
};

function DialogMenuItem({ children, icon }: React.PropsWithChildren<DialogMenuItemProps>) {
  const Icon = icon;

  return (
    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white">
      <Icon className="w-5 h-5 mr-2 text-violet-400 hover:text-violet-300" aria-hidden="true" />
      {children}
    </button>
  );
}
