'use client';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { onActionHttpError } from '../../utils/http/action-http-error';

export const SWRProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        onError: onActionHttpError,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export const SWRProviderWithoutCache = ({ children }: PropsWithChildren) => {
  return (
    <SWRProvider>
      <SWRConfig
        value={{
          provider: () => new Map(),
        }}
      >
        {children}
      </SWRConfig>
    </SWRProvider>
  );
};
