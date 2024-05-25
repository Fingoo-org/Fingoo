'use client';
import { GoogleAnalytics } from '@next/third-parties/google';
import { LoggingContext, type UserTracker } from '../logging-context';
import { sendGAEvent } from '@next/third-parties/google';

export default function GoogleAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const userTracker: UserTracker = {
    track(event, properties) {
      sendGAEvent({
        event,
        ...properties,
      });
    },
  };

  return (
    <>
      <LoggingContext.Provider value={userTracker}>{children}</LoggingContext.Provider>
      <GoogleAnalytics gaId="G-N8X0FGQ27D" />
    </>
  );
}
