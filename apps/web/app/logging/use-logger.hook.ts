import { UserTracker, LoggingContext, UserEvent } from './logging-context';

import { useContext } from 'react';

export const useLogger = (): UserTracker => {
  const logger = useContext(LoggingContext);

  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    return {
      track: (event: UserEvent, properties?: Record<string, unknown>) => {
        console.log('Logging event:', event);
        console.log('Logging properties:', properties);
      },
    };
  }

  if (!logger) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }

  return logger;
};
