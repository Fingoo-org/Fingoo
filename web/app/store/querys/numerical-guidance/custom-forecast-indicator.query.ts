import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { defaultFetcher, postFetcher } from '../fetcher';

export type sourceIndicator = {
  id: string;
  weight: number;
};

export type CustomForecastIndicatorResponse = {
  id: string;
  name: string;
  targetIndicatorId: string;
  sourceIndicatorIdsAndweights: sourceIndicator[];
};

export type CustomForecastIndicatorListResponse = {
  customForecastIndicatorList: CustomForecastIndicatorResponse[];
};

export type CreateCustomForecastIndicatorRequestBody = {
  name: string;
  targetIndicatorId: string;
};

export const useFetchCustomForecastIndicatorList = () => {
  return useSWR<CustomForecastIndicatorListResponse>(API_PATH.customForecastIndicator, defaultFetcher);
};

export const useCreateCustomForecastIndicator = () => {
  return useSWRMutation(API_PATH.customForecastIndicator, postFetcher<CreateCustomForecastIndicatorRequestBody>);
};

export type AddSourceIndicatorToCustomForecastIndicatorRequestBody = {
  sourceIndicatorsAndweights: sourceIndicator[];
};

export const useAddSourceIndicatorToCustomForecastIndicator = (customForecastIndicatorId: string | undefined) => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    async (url: string, { arg }: { arg: AddSourceIndicatorToCustomForecastIndicatorRequestBody }) => {
      if (!customForecastIndicatorId) return;
      await postFetcher<AddSourceIndicatorToCustomForecastIndicatorRequestBody>([url, customForecastIndicatorId], {
        arg,
      });
    },
  );
};
