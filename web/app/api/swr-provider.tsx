'use client';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { defaultFetcher } from './query/fetcher';

export const SWRProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export const SWRProviderWithoutCache = ({ children }: PropsWithChildren) => {
  return (
    <SWRProvider>
      <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
    </SWRProvider>
  );
};
