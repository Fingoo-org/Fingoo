import SideNav from '../../ui/pages/workspace/side-bar/sidenav';
import FloatingComponentContainer from '../../ui/pages/workspace/floating-component-container';
import ChatAiNavigator from '@/app/ui/pages/workspace/chat-ai-navigator';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen md:flex-row md:overflow-hidden">
      <SideNav />
      <div className="grow bg-fingoo-gray-1.5">{children}</div>
      <ChatAiNavigator />
      <FloatingComponentContainer />
    </div>
  );
}
