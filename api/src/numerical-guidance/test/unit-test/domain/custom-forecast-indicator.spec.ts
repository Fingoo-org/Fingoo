import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorNameShouldNotEmpty } from 'src/numerical-guidance/domain/rule/CustomForecastIndicatorNameShouldNotEmpty.rule';
import { BusinessRuleValidationException } from 'src/utils/domain/business-rule-validation.exception';
import { IndicatorType } from 'src/utils/type/type-definition';

describe('예측지표', () => {
  it('예측 지표 생성', () => {
    // given

    // when
    const customForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
    );

    // then
    const type: IndicatorType = 'customForecastIndicator';
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

  it('예측지표생성-자표이름이 빈 값일 경우 - 빈 문자열일 경우', () => {
    // given
    const content = '';
    // when
    function createNewCustomForecastIndicator() {
      CustomForecastIndicator.createNew(content, 'f5206520-da94-11ee-b91b-3551e6db3bbd');
    }
    const rule = new CustomForecastIndicatorNameShouldNotEmpty(content);

    // then
    expect(createNewCustomForecastIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewCustomForecastIndicator).toThrow(rule.Message);
  });

  it('예측지표생성-자표이름이 빈 값일 경우 - 공백일 경우', () => {
    // given
    const content = '      ';
    // when
    function createNewCustomForecastIndicator() {
      CustomForecastIndicator.createNew(content, 'f5206520-da94-11ee-b91b-3551e6db3bbd');
    }
    const rule = new CustomForecastIndicatorNameShouldNotEmpty(content);

    // then
    expect(createNewCustomForecastIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewCustomForecastIndicator).toThrow(rule.Message);
  });
});
