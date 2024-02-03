import { PropsWithChildren } from 'react';

type SelectableListItemProps = {
  style?: React.CSSProperties;
};

export default function ListItem({ children, style }: PropsWithChildren<SelectableListItemProps>) {
  return (
    <li>
      <div
        style={style}
        className="bg-gray-100 hover:text-blue-700 hover:bg-blue-50 rounded flex p-4 h-full items-center font-medium"
      >
        {children}
      </div>
    </li>
  );
}
