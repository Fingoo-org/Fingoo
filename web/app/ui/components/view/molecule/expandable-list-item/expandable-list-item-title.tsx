export function ExpandableListItemTitle({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex items-center font-bold hover:text-blue-700 hover:opacity-20">{children}</div>;
}
