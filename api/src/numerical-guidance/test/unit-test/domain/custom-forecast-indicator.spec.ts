import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { IndicatorType } from 'src/utils/type/type-definition';

describe('Custom forecast indicator', () => {
  it('예측 지표 생성', () => {
    // given

    // when
    const customForecastIndicator = CustomForecastIndicator.createNew('예측지표 이름', '목표지표 uuid');

    // then
    const type: IndicatorType = 'CustomForecastIndicator';
    const expected = new CustomForecastIndicator('uuid', '예측지표 이름', type, '목표지표 uuid', [], [], []);
    expect(expected.customForecastIndicatorName).toEqual(customForecastIndicator.customForecastIndicatorName);
    expect(expected.targetIndicatorId).toEqual(customForecastIndicator.targetIndicatorId);
  });
});
