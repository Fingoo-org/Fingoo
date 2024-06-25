import { UserTracker, LoggingContext, UserEvent } from './logging-context';

import { useContext } from 'react';

export const useLogger = (): UserTracker => {
  const logger = useContext(LoggingContext);
  if (!logger) {
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      return {
        track: (event: UserEvent) => {
          console.log('Logging event:', event);
        },
      };
    }
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return logger;
};
