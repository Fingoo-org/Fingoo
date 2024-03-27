import { PropsWithChildren } from 'react';

type ListItemProps = {
  hoverRender?: () => JSX.Element;
  style?: React.CSSProperties;
};

export default function ListItem({ style, hoverRender, children }: PropsWithChildren<ListItemProps>) {
  return (
    <div style={style} className="group relative w-full ">
      {children}
      {hoverRender ? (
        <div className="invisible absolute right-3 top-2/4 z-10  -translate-y-2/4 group-has-[:hover]:visible">
          <div className="flex items-center justify-center">{hoverRender()}</div>
        </div>
      ) : null}
    </div>
  );
}
