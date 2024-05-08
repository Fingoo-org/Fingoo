import MSWComponent from '../ui/components/util/msw-component';
import { SWRProvider } from '../ui/components/util/swr-provider';

interface LayoutProps {
  children: React.ReactNode;
}

function SubPageLayout({ children }: LayoutProps) {
  return (
    <>
      <MSWComponent>
        <SWRProvider>{children}</SWRProvider>
      </MSWComponent>
    </>
  );
}

export default SubPageLayout;
