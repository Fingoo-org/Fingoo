import SideNav from '../ui/pages/workspace/sidenav';
import FloatingComponentContainer from '../ui/pages/workspace/floating-component-container';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-96">
        <SideNav />
      </div>
      <div className="w-full">{children}</div>
      <FloatingComponentContainer />
    </div>
  );
}
