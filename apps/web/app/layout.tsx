import type { Metadata } from 'next';
import './globals.css';
import { cn } from './utils/style';
import localFont from 'next/font/local';
import GoogleAnalyticsProvider from './logging/provider/google-analytics-provider';

import Script from 'next/script';

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
