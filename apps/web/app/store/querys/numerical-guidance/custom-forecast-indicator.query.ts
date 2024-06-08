import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import { mutate } from 'swr';

import { API_PATH } from '../api-path';
import {
  defaultFetcher,
  deleteFetcher,
  fetchCustomForecastIndicatorsValue,
  patchFetcher,
  postFetcher,
} from '../fetcher';
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';
import { IndicatorByTypeResponse } from './indicator-list.query';
import { unstable_serialize } from 'swr';

export type sourceIndicator = {
  sourceIndicatorId: string;
  weight: number;
  indicatorType: IndicatorType;
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
  targetIndicator: IndicatorByTypeResponse;
  grangerVerification: VerificationType[];
  cointJohansenVerification: VerificationType[];
  sourceIndicatorsInformation: sourceIndicator[];
  sourceIndicators: IndicatorByTypeResponse[];
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
  const { cache } = useSWRConfig();

  // 삭제를 위한 key 순서 맞춰보기
  const key = customForecastIndicatorIds
    ? [`${API_PATH.customForecastIndicator}/value`, ...customForecastIndicatorIds]
    : null;

  return useSWRImmutable<CustomForecastIndicatorValueResponse[], any, string[] | null>(key, async (key) => {
    const previousKey = key.slice(0, -1);
    const previousData = cache.get(unstable_serialize(previousKey))?.data;
    if (previousData) {
      const newKey = [key[0], key[key.length - 1]];
      const newData = await fetchCustomForecastIndicatorsValue(newKey);
      return [...previousData, ...newData];
    }

    return await fetchCustomForecastIndicatorsValue(key);
  });
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

export const useUpdateSourceIndicator = (customForecastIndicatorId?: string) => {
  return useSWRMutation(
    API_PATH.customForecastIndicator,
    async (
      url: string,
      { arg }: { arg: updateSourceIndicatorRequestBody & { customForecastIndicatorId?: string } },
    ) => {
      if (!customForecastIndicatorId && !arg.customForecastIndicatorId) return;

      const id = (arg.customForecastIndicatorId || customForecastIndicatorId)!;
      await patchFetcher<updateSourceIndicatorRequestBody>([url, id], {
        arg: {
          sourceIndicatorsInformation: arg.sourceIndicatorsInformation,
        },
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

export const useRevalidateCustomForecastIndicatorList = () => {
  return () => {
    mutate(API_PATH.customForecastIndicator);
  };
};
