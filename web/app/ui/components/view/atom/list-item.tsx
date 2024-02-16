import { PropsWithChildren } from 'react';

type SelectableListItemProps = {
  style?: React.CSSProperties;
};

export default function ListItem({ children, style }: PropsWithChildren<SelectableListItemProps>) {
  return (
    <div
      style={style}
      className=" hover:text-blue-700 hover:opacity-20 hover:bg-blue-50 rounded flex h-full items-center font-medium"
    >
      {children}
    </div>
  );
}
