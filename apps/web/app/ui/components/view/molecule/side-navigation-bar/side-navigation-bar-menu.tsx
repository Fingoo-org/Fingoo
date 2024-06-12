import { cn } from '@/app/utils/style';

type SideNavigationBarMenuProps = {
  icon: React.ElementType;
  value: string;
  selected?: boolean;
  onClick?: (value: string) => void;
};

export function SideNavigationBarMenu({ value, selected, icon, onClick }: SideNavigationBarMenuProps) {
  const Icon = icon;

  const handleClick = () => {
    onClick?.(value);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'h-14 w-14  transition-all duration-200 ease-in-out	',
        selected ? 'w-full rounded-l-lg rounded-r-none bg-white ' : '',
      )}
    >
      <div
        className={cn(
          'transition-color flex h-14 w-14 items-center rounded-full ease-in-out ',
          selected ? 'hover:bg-transparent' : ' hover:bg-[#575757]',
        )}
      >
        <Icon className={cn('ml-3 h-8 w-8 ', selected ? 'text-black' : 'text-white')} />
      </div>
    </button>
  );
}
