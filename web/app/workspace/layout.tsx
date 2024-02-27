import MetadataDialogMenu from '../ui/components/numerical-guidance/molecule/metadata-dialog-menu/metadata-dialog-menu';
import SideNav from '../ui/pages/workspace/sidenav';
import MetadataDeleteDialog from '../ui/components/numerical-guidance/molecule/metadata-delete-dialog';
import IndicatorDialogMenu from '../ui/components/numerical-guidance/molecule/indicator-dialog-menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-96">
        <SideNav />
      </div>
      <div className="w-full">{children}</div>
      <MetadataDialogMenu />
      <MetadataDeleteDialog />
      <IndicatorDialogMenu />
    </div>
  );
}
