import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorsValueByMetadata } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-value-by-metadata.hook';

describe('useCustomForecastIndicatorsValueViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('메타데이터가 선택되어 있을 때, 메타데이터에 예측 지표를 추가하면, 예측 지표 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        return {
          ...useCustomForecastIndicatorsValueViewModel('1'),
          ...useSelectedIndicatorBoardMetadata(),
        };
      },
      { wrapper: SWRProviderWithoutCache },
    );
    act(() => {
      result.current.selectMetadataById('1');
    });

    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // when
    act(() => {
      result.current.addCustomForecastIndicatorToMetadata('14');
    });

    // then
    await waitFor(() => expect(result.current.customForecastIndicatorsValue).toHaveLength(1));
  });

  it('메타데이터가 선택되어 있을 때, 메타데이터에 예측 지표를 추가하면, 예측지표 타입을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => {
        return {
          ...useCustomForecastIndicatorsValueByMetadata(),
          ...useSelectedIndicatorBoardMetadata(),
        };
      },
      { wrapper: SWRProviderWithoutCache },
    );
    act(() => {
      result.current.selectMetadataById('1');
    });

    await waitFor(() => expect(result.current.selectedMetadata).not.toBeUndefined());

    // when
    act(() => {
      result.current.addCustomForecastIndicatorToMetadata('14');
    });

    // then
    await waitFor(() => expect(result.current.customForecastTypes).toHaveLength(1));
    expect(result.current.customForecastTypes?.[0].customForecastIndicatorId).toBe('14');
    expect(result.current.customForecastTypes?.[0].forecastType).toBe('multi');
  });
});
