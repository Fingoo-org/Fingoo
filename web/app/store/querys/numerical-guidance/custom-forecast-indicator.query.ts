import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import {
  defaultFetcher,
  deleteFetcher,
  fetchCustomForecastIndicatorsValue,
  patchFetcher,
  postFetcher,
} from '../fetcher';

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

export type CreateCustomForecastIndicatorResponse = string;

export const useFetchCustomForecastIndicatorList = () => {
  return useSWR<CustomForecastIndicatorListResponse>(API_PATH.customForecastIndicator, defaultFetcher);
};

type CustomForecastIndicatorValueItem = {
  date: string;
  value: number;
};

export type CustomForecastIndicatorValueResponse = {
  customForecastIndicatorId: string;
  targetIndicatorId: string;
  name: string;
  ticker: string;
  market: string;
  type: string;
  customForecastIndicatorValues: CustomForecastIndicatorValueItem[];
  targetIndicatorValues: CustomForecastIndicatorValueItem[];
};

export const useFetchCustomForecastIndicatorsValue = (customForecastIndicatorIds: string[] | undefined) => {
  const key = customForecastIndicatorIds ? [API_PATH.customForecastIndicator, ...customForecastIndicatorIds] : null;

  return useSWR<CustomForecastIndicatorValueResponse[], any, string[] | null>(key, fetchCustomForecastIndicatorsValue);
};

export const useCreateCustomForecastIndicator = () => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    postFetcher<CreateCustomForecastIndicatorRequestBody, CreateCustomForecastIndicatorResponse>,
  );
};

export type updateSourceIndicatorRequestBody = {
  sourceIndicatorIdsAndWeights: sourceIndicator[];
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

export const useDeleteCustomForecastIndicator = () => {
  return useSWRMutation(API_PATH.customForecastIndicator, async (url, { arg: metadataId }: { arg: string }) => {
    await deleteFetcher([url, metadataId]);
  });
};

export type UpdatecustomForecastIndicatorNameRequestBody = {
  name: string;
};

export const useUpdateCustomForecastIndicatorName = (customForecastIndicatorId: string | undefined) => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    async (url: string, { arg }: { arg: UpdatecustomForecastIndicatorNameRequestBody }) => {
      if (!customForecastIndicatorId) return;
      await patchFetcher<UpdatecustomForecastIndicatorNameRequestBody>([url, 'name', customForecastIndicatorId], {
        arg,
      });
    },
  );
};
