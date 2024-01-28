import { PlusIcon } from '@heroicons/react/16/solid';
type ListItemProps = {
  content: string;
  selected?: boolean;
  style?: React.CSSProperties;
};

export default function ListItem({ content, selected, style }: ListItemProps) {
  return (
    <li>
      <div
        style={style}
        className="bg-gray-100 hover:text-blue-700 hover:bg-blue-50 rounded flex p-4 h-full items-center justify-between"
      >
        <span className="font-medium">{content}</span>
        {selected && <PlusIcon className=" h-5 w-5 text-black" />}
      </div>
    </li>
  );
}
