import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';
import { IndicatorBoardMetaDataMustNotBeEmptyRule } from '../../../domain/rule/IndicatorBoardMetaDataMustNotBeEmpty.rule';
import { BusinessRuleValidationException } from '../../../../building-blocks/domain/business-rule-validation.exception';

describe('지표보드 메타데이터', () => {
  it('포스트를 게시한다', () => {
    // given

    // when
    const indicatorBoardMetaData = IndicatorBoardMetaData.createNew('메타 데이터', { key1: ['1', '2', '3'] }, 1);

    // then
    const expected = new IndicatorBoardMetaData('메타 데이터', { key1: ['1', '2', '3'] }, 1);
    expect(expected).toEqual(indicatorBoardMetaData);
  });

  it('지표보드 메타데이터의 지표는 비어있지만, key값은 1개로 고정이다.', () => {
    //given
    const content = { key1: ['1', '2', '3'], key2: ['1', '2', '3'] };

    //when
    function createPost() {
      IndicatorBoardMetaData.createNew('메타 데이터', content, 1);
    }
    const rule = new IndicatorBoardMetaDataMustNotBeEmptyRule(content);

    //then
    expect(createPost).toThrow(BusinessRuleValidationException);
    expect(createPost).toThrow(rule.Message);
  });
});
