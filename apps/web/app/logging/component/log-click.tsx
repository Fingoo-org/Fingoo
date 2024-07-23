import React from 'react';
import { UserEvent } from '../logging-context';
import { useLogger } from '../use-logger.hook';

type LogClickProps = {
  event: UserEvent;
  properties?: Record<string, unknown>;
};

export function LogClick({ children, event, properties }: React.PropsWithChildren<LogClickProps>) {
  const logger = useLogger();

  const child = React.Children.only(children);

  if (!React.isValidElement(child)) {
    return <>{children}</>;
  }

  return React.cloneElement(child as React.ReactElement, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      logger.track(event, properties);

      if (child.props && typeof child.props['onClick'] === 'function') {
        return child.props['onClick'](e);
      }
    },
  });
}
