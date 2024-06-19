import ChatProvider from '../business/hooks/linguistic-guidance/provider/chat-provider';
import MSWComponent from '../ui/components/util/msw-component';
import { SWRProvider } from '../ui/components/util/swr-provider';

interface LayoutProps {
  children: React.ReactNode;
}

function SubPageLayout({ children }: LayoutProps) {
  return (
    <>
      <MSWComponent>
        <ChatProvider>
          <SWRProvider>{children}</SWRProvider>
        </ChatProvider>
      </MSWComponent>
    </>
  );
}

export default SubPageLayout;
