import SideNav from '../ui/pages/workspace/side-bar/sidenav';
import FloatingComponentContainer from '../ui/pages/workspace/floating-component-container';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen md:flex-row md:overflow-hidden">
      <SideNav />
      <div className="grow">{children}</div>
      <FloatingComponentContainer />
    </div>
  );
}
