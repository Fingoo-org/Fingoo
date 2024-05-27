import { createContext, useContext } from 'react';

export type UserEvent = 'click_metadata_item';

export type UserTracker = {
  track(event: UserEvent, properties?: Record<string, unknown>): void;
};

export const LoggingContext = createContext<UserTracker | null>(null);

export const useLogger = (): UserTracker => {
  const logger = useContext(LoggingContext);
  if (!logger) {
    if (process.env.NODE_ENV === 'test') {
      return {
        track: () => {},
      };
    }
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return logger;
};
