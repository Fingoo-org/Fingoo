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
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';

export type sourceIndicator = {
  sourceIndicatorId: string;
  weight: number;
  // indicatorType: IndicatorType;
};

export type VerificationType = {
  indicatorId: string;
  verification: 'True' | 'False';
};
export type TargetIndicatorInfo = {
  symbol: string;
  targetIndicatorId: string;
  indicatorType: IndicatorType;
};

export type CustomForecastIndicatorResponse = {
  id: string;
  customForecastIndicatorName: string;
  type: IndicatorType;
  targetIndicatorInformation: TargetIndicatorInfo;
  grangerVerification: VerificationType[];
  cointJohansenVerification: VerificationType[];
  sourceIndicatorsInformation: sourceIndicator[];
};

export type CustomForecastIndicatorListResponse = CustomForecastIndicatorResponse[];

export type CreateCustomForecastIndicatorRequestBody = {
  customForecastIndicatorName: string;
  targetIndicatorId: string;
  targetIndicatorType: IndicatorType;
};

export type CreateCustomForecastIndicatorResponse = string;

export const useFetchCustomForecastIndicatorList = () => {
  return useSWR<CustomForecastIndicatorListResponse>(API_PATH.customForecastIndicator, defaultFetcher);
};

type CustomForecastIndicatorValueItem = {
  date: string;
  value: number | string;
};

export type ForecastType = 'multi' | 'single';

export type CustomForecastIndicatorValueResponse = {
  customForecastIndicatorId: string;
  targetIndicatorId: string;
  type: IndicatorType;
  ticker: string;
  forecastType: ForecastType;
  customForecastIndicatorValues: CustomForecastIndicatorValueItem[];
  targetIndicatorValues: CustomForecastIndicatorValueItem[];
};

export const useFetchCustomForecastIndicatorsValue = (customForecastIndicatorIds: string[] | undefined) => {
  const key = customForecastIndicatorIds
    ? [`${API_PATH.customForecastIndicator}/value`, ...customForecastIndicatorIds]
    : null;

  return useSWR<CustomForecastIndicatorValueResponse[], any, string[] | null>(key, fetchCustomForecastIndicatorsValue);
};

export const useCreateCustomForecastIndicator = () => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    postFetcher<CreateCustomForecastIndicatorRequestBody, CreateCustomForecastIndicatorResponse>,
  );
};

export type updateSourceIndicatorRequestBody = {
  sourceIndicatorsInformation: sourceIndicator[];
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
