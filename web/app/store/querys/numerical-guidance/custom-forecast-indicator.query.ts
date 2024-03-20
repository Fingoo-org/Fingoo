import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { defaultFetcher, patchFetcher, postFetcher } from '../fetcher';

export type sourceIndicator = {
  sourceIndicatorId: string;
  weight: number;
};

export type CustomForecastIndicatorResponse = {
  id: string;
  customForecastIndicatorName: string;
  targetIndicatorId: string;
  sourceIndicatorIdsAndWeights: sourceIndicator[];
};

export type CustomForecastIndicatorListResponse = CustomForecastIndicatorResponse[];

export type CreateCustomForecastIndicatorRequestBody = {
  customForecastIndicatorName: string;
  targetIndicatorId: string;
};

export const useFetchCustomForecastIndicatorList = () => {
  return useSWR<CustomForecastIndicatorListResponse>(API_PATH.customForecastIndicator, defaultFetcher);
};

export const useCreateCustomForecastIndicator = () => {
  return useSWRMutation(API_PATH.customForecastIndicator, postFetcher<CreateCustomForecastIndicatorRequestBody>);
};

export type updateSourceIndicatorRequestBody = {
  sourceIndicatorsAndweights: sourceIndicator[];
};

export const useUpdateSourceIndicator = (customForecastIndicatorId: string | undefined) => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    async (url: string, { arg }: { arg: updateSourceIndicatorRequestBody }) => {
      if (!customForecastIndicatorId) return;
      await patchFetcher<updateSourceIndicatorRequestBody>([url, customForecastIndicatorId], {
        arg,
      });
    },
  );
};
