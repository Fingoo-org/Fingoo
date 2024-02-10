import MetadataDialogMenu from '../ui/components/numerical-guidance/metadata-dialog-menu';
import SideNav from '../ui/pages/workspace/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-96">
        <SideNav />
      </div>
      <div className="w-full">{children}</div>
      <div className="fixed inset-0 pointer-events-none	overflow-hidden	z-50">
        <MetadataDialogMenu />
      </div>
    </div>
  );
}
