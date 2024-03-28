import React, { PropsWithChildren } from 'react';

type ListItemProps = {
  style?: React.CSSProperties;
  hoverDecorator?: ({ children }: { children: React.ReactNode }) => JSX.Element;
  hoverRender?: () => JSX.Element;
};

export default function ListItem({ style, hoverRender, hoverDecorator, children }: PropsWithChildren<ListItemProps>) {
  const HoverDecorator = hoverDecorator;
  return (
    <div style={style} className="group relative w-full ">
      {children}
      {hoverRender ? (
        HoverDecorator ? (
          <HoverDecorator>{hoverRender()}</HoverDecorator>
        ) : (
          <div className="invisible absolute right-3 top-2/4 z-10  -translate-y-2/4 group-has-[:hover]:visible">
            <div className="flex items-center justify-center">{hoverRender()}</div>
          </div>
        )
      ) : null}
    </div>
  );
}
