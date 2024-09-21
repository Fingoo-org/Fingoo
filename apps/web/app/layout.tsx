import type { Metadata } from 'next';
import './globals.css';
import { cn } from './utils/style';
import localFont from 'next/font/local';
import GoogleAnalyticsProvider from './logging/provider/google-analytics-provider';
import MockingUser from './ui/components/util/mocking-user';
import ChatAiNavigator from './ui/pages/workspace/chat-ai-navigator';
import FloatingComponentContainer from './ui/pages/workspace/floating-component-container';
import SideNav from './ui/pages/workspace/side-bar/sidenav';
import { SWRProvider } from './ui/components/util/swr-provider';
import ChatProvider from './business/hooks/linguistic-guidance/provider/chat-provider';
import Script from "next/script";

const myFont = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'fingoo beta',
  description: 'fingoo beta version',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="kr"
      className="scrollbar-track-white scrollbar-thumb-slate-200 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-1.5"
    >
      <GoogleAnalyticsProvider>
        <body className={cn(myFont.variable, 'font-pretendard')}>
          <MockingUser>
            <ChatProvider>
              <SWRProvider>
                <div className="flex h-screen md:flex-row md:overflow-hidden">
                  <SideNav />
                  <div className="grow bg-fingoo-gray-1.5">{children}</div>
                  <ChatAiNavigator />
                  <FloatingComponentContainer />
                </div>
              </SWRProvider>
            </ChatProvider>
          </MockingUser>
        </body>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7019952761112111`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
      />
      </GoogleAnalyticsProvider>
    </html>
  );
}
