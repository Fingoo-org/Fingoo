import { PropsWithChildren } from 'react';

type ListItemProps = {
  withHoverComponent?: React.ReactNode;
  style?: React.CSSProperties;
};

export default function ListItem({ style, withHoverComponent, children }: PropsWithChildren<ListItemProps>) {
  return (
    <div style={style} className="group relative h-16 w-full">
      {children}
      {withHoverComponent ? (
        <div className="z-index-1 invisible absolute right-3 top-2/4  -translate-y-2/4 group-has-[:hover]:visible">
          {withHoverComponent}
        </div>
      ) : null}
    </div>
  );
}
