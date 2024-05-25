import { createContext, useContext } from 'react';

export type UserEvent = 'home:product-tour-button:click' | 'home:apply-button:click';

export type UserTracker = {
  track(event: UserEvent, properties?: Record<string, unknown>): void;
};

export const LoggingContext = createContext<UserTracker | null>(null);

export const useLogging = (): UserTracker => {
  const logger = useContext(LoggingContext);
  if (!logger) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return logger;
};
