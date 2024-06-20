import type { Metadata } from 'next';
import './globals.css';
import { cn } from './utils/style';
import localFont from 'next/font/local';
import GoogleAnalyticsProvider from './logging/provider/google-analytics-provider';

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
        <body className={cn(myFont.variable, 'font-pretendard')}>{children}</body>
      </GoogleAnalyticsProvider>
    </html>
  );
}
