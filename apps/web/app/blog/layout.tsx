interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-white">{children}</div>;
}

export default Layout;
