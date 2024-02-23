import { PropsWithChildren } from 'react';

type SelectableListItemProps = {
  style?: React.CSSProperties;
};

export default function ListItem({ children, style }: PropsWithChildren<SelectableListItemProps>) {
  return (
    <div
      style={style}
      className=" flex h-full items-center rounded font-medium hover:bg-blue-50 hover:text-blue-700 hover:opacity-20"
    >
      {children}
    </div>
  );
}
