import { PropsWithChildren } from 'react';

type ListItemProps = {
  hoverRender?: () => JSX.Element;
  style?: React.CSSProperties;
};

export default function ListItem({ style, hoverRender, children }: PropsWithChildren<ListItemProps>) {
  return (
    <div style={style} className="group relative h-8 w-full ">
      {children}
      {hoverRender ? (
        <div className="z-index-1 invisible absolute right-3 top-2/4  -translate-y-2/4 group-has-[:hover]:visible">
          <div className="flex items-center justify-center">{hoverRender()}</div>
        </div>
      ) : null}
    </div>
  );
}
