import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { IndicatorType } from 'src/utils/type/type-definition';

describe('Custom forecast indicator', () => {
  it('예측 지표 생성', () => {
    // given

    // when
    const customForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
    );

    // then
    const type: IndicatorType = 'CustomForecastIndicator';
    const expected = new CustomForecastIndicator(
      'uuid',
      '예측지표 이름',
      type,
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
      [],
      [],
      [],
    );
    expect(expected.customForecastIndicatorName).toEqual(customForecastIndicator.customForecastIndicatorName);
    expect(expected.targetIndicatorId).toEqual(customForecastIndicator.targetIndicatorId);
  });
});
