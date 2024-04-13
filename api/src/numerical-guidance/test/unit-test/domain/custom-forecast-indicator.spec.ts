import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorNameShouldNotEmptyRule } from 'src/numerical-guidance/domain/rule/CustomForecastIndicatorNameShouldNotEmpty.rule';
import { SourceIndicatorCountShouldNotExceedLimitRule } from 'src/numerical-guidance/domain/rule/SourceIndicatorCountShouldNotBeExeedLimit.rule';
import { SourceIndicatorsShouldNotDuplicateRule } from 'src/numerical-guidance/domain/rule/SourceIndicatorsShouldNotDuplicate.rule';
import { BusinessRuleValidationException } from 'src/utils/domain/business-rule-validation.exception';
import { IndicatorType, SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

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

  it('예측지표 생성-지표이름이 빈 값일 경우 - 빈 문자열일 경우', () => {
    // given
    const content = '';
    // when
    function createNewCustomForecastIndicator() {
      CustomForecastIndicator.createNew(content, 'f5206520-da94-11ee-b91b-3551e6db3bbd');
    }
    const rule = new CustomForecastIndicatorNameShouldNotEmptyRule(content);

    // then
    expect(createNewCustomForecastIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewCustomForecastIndicator).toThrow(rule.Message);
  });

  it('예측지표 생성-지표이름이 빈 값일 경우 - 공백일 경우', () => {
    // given
    const content = '      ';
    // when
    function createNewCustomForecastIndicator() {
      CustomForecastIndicator.createNew(content, 'f5206520-da94-11ee-b91b-3551e6db3bbd');
    }
    const rule = new CustomForecastIndicatorNameShouldNotEmptyRule(content);

    // then
    expect(createNewCustomForecastIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewCustomForecastIndicator).toThrow(rule.Message);
  });

  it('예측지표 업데이트', () => {
    // given
    const customForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
    );

    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120011',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120021',
        weight: 'none',
      },
    ];

    // when
    customForecastIndicator.updateSourceIndicatorsAndWeights(sourceIndicatorIdsAndWeights);

    // then
    const expected = sourceIndicatorIdsAndWeights;
    expect(customForecastIndicator.sourceIndicatorIdsAndWeights).toEqual(expected);
  });

  it('예측지표 업데이트 - 재료지표와 가중치 없는 상태로 업데이트', () => {
    // given
    const customForecastIndicator = new CustomForecastIndicator(
      '26929514-237c-11ed-861d-0242ac120011',
      'updatedCustomForecastIndicator',
      'customForecastIndicator',
      '26929514-237c-11ed-861d-0242ac120012',
      [
        {
          indicatorId: '26929514-237c-11ed-861d-0242ac120013',
          verification: 'True',
        },
      ],
      [
        {
          indicatorId: '26929514-237c-11ed-861d-0242ac120013',
          verification: 'True',
        },
      ],
      [
        {
          weight: 50,
          sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120013',
        },
      ],
    );

    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [];

    // when
    customForecastIndicator.updateSourceIndicatorsAndWeights(sourceIndicatorIdsAndWeights);

    // then
    const expected = [];
    expect(customForecastIndicator.sourceIndicatorIdsAndWeights).toEqual(expected);
  });

  it('예측지표 업데이트 - 재료 지표가 중복될 때', () => {
    // given
    const customForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
    );

    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120021',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120021',
        weight: 'none',
      },
    ];

    // when
    function updateSourceIndicatorsAndWeights() {
      customForecastIndicator.updateSourceIndicatorsAndWeights(sourceIndicatorIdsAndWeights);
    }
    const rule = new SourceIndicatorsShouldNotDuplicateRule(sourceIndicatorIdsAndWeights);

    // then
    expect(updateSourceIndicatorsAndWeights).toThrow(BusinessRuleValidationException);
    expect(updateSourceIndicatorsAndWeights).toThrow(rule.Message);
  });

  it('예측지표 업데이트 - 재료 지표가 10개가 넘어갈 경우', () => {
    // given
    const customForecastIndicator = CustomForecastIndicator.createNew(
      '예측지표 이름',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
    );

    const sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[] = [
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120011',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120021',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120031',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120041',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120051',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120061',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120071',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120081',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120091',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120012',
        weight: 'none',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120022',
        weight: 'none',
      },
    ];

    // when
    function updateSourceIndicatorsAndWeights() {
      customForecastIndicator.updateSourceIndicatorsAndWeights(sourceIndicatorIdsAndWeights);
    }
    const rule = new SourceIndicatorCountShouldNotExceedLimitRule(sourceIndicatorIdsAndWeights);

    // then
    expect(updateSourceIndicatorsAndWeights).toThrow(BusinessRuleValidationException);
    expect(updateSourceIndicatorsAndWeights).toThrow(rule.Message);
  });

  it('예측지표 이름을 수정한다.', () => {
    // given
    const customForecastIndicator = new CustomForecastIndicator(
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
      '예측지표',
      'customForecastIndicator',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
      [],
      [],
      [],
    );

    // when
    customForecastIndicator.updateCustomForecastIndicatorName('수정한 이름');
    const expected = '수정한 이름';

    // then
    expect(expected).toEqual(customForecastIndicator.customForecastIndicatorName);
  });

  it('예측지표 이름을 수정한다. - 이름이 비었을 때', () => {
    // given
    const customForecastIndicator = new CustomForecastIndicator(
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
      '예측지표',
      'customForecastIndicator',
      'f5206520-da94-11ee-b91b-3551e6db3bbd',
      [],
      [],
      [],
    );

    const content = '';

    // when
    function updateCustomForecastIndicatorName() {
      customForecastIndicator.updateCustomForecastIndicatorName(content);
    }
    const rule = new CustomForecastIndicatorNameShouldNotEmptyRule(content);

    // then
    expect(updateCustomForecastIndicatorName).toThrow(BusinessRuleValidationException);
    expect(updateCustomForecastIndicatorName).toThrow(rule.Message);
  });
});
