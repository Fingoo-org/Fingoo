type SideNavigationBarContentProps = {
  value: string;
};

export default function SideNavigationBarContent({ children }: React.PropsWithChildren<SideNavigationBarContentProps>) {
  return <>{children}</>;
}
