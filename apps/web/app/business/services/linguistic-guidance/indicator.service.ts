import { API_PATH } from '@/app/store/querys/api-path';
import { AddIndicatorToMetadataRequestBody } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { IndicatorValueResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
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
      startDate: '2024-02-27',
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
