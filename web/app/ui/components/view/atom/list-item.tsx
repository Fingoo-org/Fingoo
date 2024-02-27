import { PropsWithChildren } from 'react';

type ListItemProps = {
  hoverRender?: () => JSX.Element;
  style?: React.CSSProperties;
};

export default function ListItem({ style, hoverRender, children }: PropsWithChildren<ListItemProps>) {
  return (
    <div style={style} className="group relative h-16 w-full bg-white">
      {children}
      {hoverRender ? (
        <div className="z-index-1 invisible absolute right-3 top-2/4  -translate-y-2/4 group-has-[:hover]:visible">
          {hoverRender()}
        </div>
      ) : null}
    </div>
  );
}
