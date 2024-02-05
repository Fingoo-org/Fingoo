'use client';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { defaultFetcher } from './fetcher';
import { onActionHttpError } from '../../utils/http/action-http-error';

export const SWRProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
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
          fetcher: defaultFetcher,
        }}
      >
        {children}
      </SWRConfig>
    </SWRProvider>
  );
};
