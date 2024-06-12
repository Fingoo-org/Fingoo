type SideNavigationBarContentProps = {
  value: string;
};

export function SideNavigationBarContent({ children }: React.PropsWithChildren<SideNavigationBarContentProps>) {
  return <>{children}</>;
}
