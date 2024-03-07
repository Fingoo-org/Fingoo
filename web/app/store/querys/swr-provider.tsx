'use client';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { onActionHttpError } from '../../business/services/error-action/action-http-error';
import { useToast } from '@/app/ui/components/view/hooks/use-toast';

export const SWRProvider = ({ children }: PropsWithChildren) => {
  const { toast } = useToast();

  return (
    <SWRConfig
      value={{
        onError: onActionHttpError.bind(null, toast),
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
