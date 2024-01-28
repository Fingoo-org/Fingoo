import { PlusIcon } from '@heroicons/react/16/solid';
import ListItem from './list-item';

type SelectableListItemProps = {
  content: string;
  selected?: boolean;
  style?: React.CSSProperties;
};

export default function SelectableListItem({ content, selected, style }: SelectableListItemProps) {
  return (
    <ListItem style={style}>
      <div className="w-full flex justify-between">
        <div>{content}</div>
        {selected && <PlusIcon className=" h-5 w-5 text-black" />}
      </div>
    </ListItem>
  );
}
