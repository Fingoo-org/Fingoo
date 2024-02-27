import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { defaultFetcher, updateFetcher } from '../fetcher';

export type CustomForecastIndicatorResponse = {
  id: string;
  name: string;
  targetIndicatorId: string;
  sourceIndicatorIds: string[];
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
  return useSWRMutation(API_PATH.customForecastIndicator, updateFetcher<CreateCustomForecastIndicatorRequestBody>);
};
