import { createContext, useContext } from 'react';

export type UserEvent =
  | 'home:product-tour-button:click'
  | 'home:apply-button:click'
  | 'workspace:metadata_list_item_select';

export type UserTracker = {
  track(event: UserEvent, properties?: Record<string, unknown>): void;
};

export const LoggingContext = createContext<UserTracker | null>(null);

export const useLogging = (): UserTracker => {
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
