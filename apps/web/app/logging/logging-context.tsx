import { createContext } from 'react';

export type UserEvent = 'home:product-tour-button:click' | 'home:apply-button:click';

export type UserTracker = {
  track(event: UserEvent, properties?: Record<string, unknown>): void;
};

export const LoggingContext = createContext<UserTracker | null>(null);

export default function LoggingProvider({ children }: { children: React.ReactNode }) {
  return <LoggingContext.Provider value={null}>{children}</LoggingContext.Provider>;
}
