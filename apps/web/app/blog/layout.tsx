import BlogBreadcrumb from './components/blog-breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed left-10 top-4">
        <BlogBreadcrumb />
      </div>
      {children}
    </div>
  );
}

export default Layout;
