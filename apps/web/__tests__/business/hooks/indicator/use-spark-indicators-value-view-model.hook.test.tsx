import { SWRProviderWithoutCache } from '@/app/ui/components/util/swr-provider';
import { resetMockDB } from '@/app/mocks/db';
import { resetAllStore } from '@/app/store/stores/reset-store';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useSparkIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-spark-indicators-value-view-model.hook';

const wrapper = SWRProviderWithoutCache;

describe('useSparkIndicatorsValueViewModel', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });

  it('지표 정보를 전달하면, 해당 지표의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => ({
        ...useSparkIndicatorsValueViewModel({
          indicators: [{ id: '1', indicatorType: 'stocks' }],
        }),
      }),
      { wrapper },
    );

    // then
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());
  });

  it('지표를 여러개 전달하면, 해당 지표들의 값을 가져온다.', async () => {
    // given
    const { result } = renderHook(
      () => ({
        ...useSparkIndicatorsValueViewModel({
          indicators: [
            { id: '1', indicatorType: 'stocks' },
            { id: '2', indicatorType: 'stocks' },
          ],
        }),
      }),
      { wrapper },
    );

    // then
    await waitFor(() => expect(result.current.indicatorsValue).not.toBeUndefined());
    expect(result.current.indicatorsValue?.length).toBe(2);
    expect(result.current.indicatorsValue?.symbolList).toEqual(['AAPL', 'MSFT']);
  });
});
