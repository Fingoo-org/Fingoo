import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from '../../../domain/rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { BusinessRuleValidationException } from '../../../../utils/domain/business-rule-validation.exception';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from '../../../domain/rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';

describe('지표보드 메타데이터', () => {
  it('포스트를 게시한다', () => {
    // given

    // when
    const indicatorBoardMetaData = IndicatorBoardMetadata.createNew('메타 데이터', { key1: ['1', '2', '3'] }, 1);

    // then
    const expected = new IndicatorBoardMetadata('메타 데이터', { key1: ['1', '2', '3'] }, 1);
    expect(expected).toEqual(indicatorBoardMetaData);
  });

  it('지표보드 메타데이터의 개수는 최대 5개를 넘을 수 없다.', () => {
    //given
    const content = { key1: ['1', '2', '3', '4', '5', '6'] };

    //when
    function createPost() {
      IndicatorBoardMetadata.createNew('메타 데이터', content, 1);
    }
    const rule = new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(content);

    //then
    expect(createPost).toThrow(BusinessRuleValidationException);
    expect(createPost).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름은 비워질 수 없다. (빈 문자열인 경우)', () => {
    //given
    const content = '';

    //when
    function createPost() {
      IndicatorBoardMetadata.createNew(content, { key1: ['1', '2', '3', '4', '5'] }, 1);
    }
    const rule = new IndicatorBoardMetaDataNameShouldNotEmptyRule(content);

    //then
    expect(createPost).toThrow(BusinessRuleValidationException);
    expect(createPost).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름은 비워질 수 없다. (공백으로만 작성한 경우)', () => {
    //given
    const content = '   ';

    //when
    function createPost() {
      IndicatorBoardMetadata.createNew(content, { key1: ['1', '2', '3', '4', '5'] }, 1);
    }
    const rule = new IndicatorBoardMetaDataNameShouldNotEmptyRule(content);

    //then
    expect(createPost).toThrow(BusinessRuleValidationException);
    expect(createPost).toThrow(rule.Message);
  });
});
