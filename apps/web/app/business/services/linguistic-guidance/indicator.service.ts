import { API_PATH } from '@/app/store/querys/api-path';
import {
  AddCustomForecastIndicatorToMetadataRequestBody,
  AddIndicatorToMetadataRequestBody,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { getStartDate } from '@/app/utils/date-formatter';
import { instance } from '@/app/utils/http';

export async function getIndicatorValue({
  id,
  indicatorType,
}: {
  id: string;
  indicatorType: IndicatorType;
}): Promise<IndicatorValueResponse> {
  const { data } = await instance.get(`${API_PATH.liveIndicatorValue}`, {
    params: {
      interval: 'week',
      indicatorType,
      startDate: getStartDate('default', 'week'),
      indicatorId: id,
    },
  });

  return data;
}

export async function addIndicatorsToMetadata(
  metadataId: string,
  indicators: { id: string; indicatorType: IndicatorType }[],
) {
  for (const indicator of indicators) {
    await instance.post<any, any, AddIndicatorToMetadataRequestBody>(
      `${API_PATH.indicatorBoardMetadata}/${metadataId}`,
      {
        indicatorId: indicator.id,
        indicatorType: indicator.indicatorType,
      },
    );
  }
}

export async function addCustomForecastIndicatorToMetadataCommand(metadataId: string, customForecastIndicatorId: string) {
  await instance.post<any, any, AddCustomForecastIndicatorToMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/custom-forecast-indicator/${metadataId}`,
    {
      customForecastIndicatorId,
    },
  );
}
