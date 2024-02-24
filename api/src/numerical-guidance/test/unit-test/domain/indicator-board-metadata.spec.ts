import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from '../../../domain/rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { BusinessRuleValidationException } from '../../../../utils/domain/business-rule-validation.exception';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from '../../../domain/rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from '../../../domain/rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { OnlyRegisteredIdCanBeRemovedRule } from '../../../domain/rule/OnlyRegisteredIdCanBeRemoved.rule';

describe('지표보드 메타데이터', () => {
  it('지표보드 메타데이터 도메인 생성', () => {
    // given

    // when
    const indicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // then
    const expected = new IndicatorBoardMetadata(null, '메타 데이터', []);
    expect(expected).toEqual(indicatorBoardMetadata);
  });

  it('지표보드 메타데이터에 새로운 지표 id 추가', () => {
    // given
    const indicatorBoardMetadata = IndicatorBoardMetadata.createNew('name');
    const indicatorId = '160e5499-4925-4e38-bb00-8ea6d8056484';

    // when
    indicatorBoardMetadata.insertIndicatorId(indicatorId);

    // then
    const expected = ['160e5499-4925-4e38-bb00-8ea6d8056484'];
    expect(expected.toString()).toEqual(indicatorBoardMetadata.indicatorIds.toString());
  });

  it('지표보드 메타데이터의 id 개수는 최대 5개를 넘을 수 없다.', () => {
    //given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);
    const indicatorId = 'indicatorId6';

    //when
    function insertIndicatorId() {
      indicatorBoardMetadata.insertIndicatorId(indicatorId);
    }
    const rule = new IndicatorBoardMetadataCountShouldNotExceedLimitRule(indicatorBoardMetadata.indicatorIds);

    //then
    expect(insertIndicatorId).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorId).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 지표 id는 중복될 수 없다.', () => {
    //given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id2', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);
    const indicatorId = 'indicatorId1';

    //when
    function insertIndicatorId() {
      indicatorBoardMetadata.insertIndicatorId(indicatorId);
    }
    const rule = new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(indicatorBoardMetadata.indicatorIds);

    //then
    expect(insertIndicatorId).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorId).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름은 비워질 수 없다. (빈 문자열인 경우)', () => {
    //given
    const content = '';

    //when
    function createNewIndicator() {
      IndicatorBoardMetadata.createNew(content);
    }
    const rule = new IndicatorBoardMetadataNameShouldNotEmptyRule(content);

    //then
    expect(createNewIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewIndicator).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름은 비워질 수 없다. (공백으로만 작성한 경우)', () => {
    //given
    const content = '   ';

    //when
    function createNewIndicator() {
      IndicatorBoardMetadata.createNew(content);
    }
    const rule = new IndicatorBoardMetadataNameShouldNotEmptyRule(content);

    //then
    expect(createNewIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewIndicator).toThrow(rule.Message);
  });

  it('지표보드 메타데이터에서 지표 id 삭제', () => {
    // given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);
    const indicatorId = 'indicatorId1';

    // when
    indicatorBoardMetadata.deleteIndicatorId(indicatorId);

    // then
    const expected = ['indicatorId2', 'indicatorId3', 'indicatorId4', 'indicatorId5'];
    expect(expected).toEqual(indicatorBoardMetadata.indicatorIds);
  });

  it('지표보드 메타데이터에서 지표 id 삭제 - 등록되지 않은 지표 요청', () => {
    // given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);
    const invalidIndicatorId = 'invalidId';

    // when
    function deleteIndicatorId() {
      indicatorBoardMetadata.deleteIndicatorId(invalidIndicatorId);
    }
    const rule = new OnlyRegisteredIdCanBeRemovedRule(indicatorBoardMetadata.indicatorIds, invalidIndicatorId);

    //then
    expect(deleteIndicatorId).toThrow(BusinessRuleValidationException);
    expect(deleteIndicatorId).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름을 수정한다. ', () => {
    // given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);

    // when
    indicatorBoardMetadata.updateIndicatorBoardMetadataName('updateName');
    const expected = 'updateName';

    //then
    expect(expected).toEqual(indicatorBoardMetadata.indicatorBoardMetadataName);
  });

  it('지표보드 메타데이터의 이름을 수정한다. - 이름이 비어있을 때 ', () => {
    // given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', [
      'indicatorId1',
      'indicatorId2',
      'indicatorId3',
      'indicatorId4',
      'indicatorId5',
    ]);
    const invalidName = '';

    // when
    function updateIndicatorBoardMetadataName() {
      indicatorBoardMetadata.updateIndicatorBoardMetadataName(invalidName);
    }
    const rule = new IndicatorBoardMetadataNameShouldNotEmptyRule(invalidName);

    //then
    expect(updateIndicatorBoardMetadataName).toThrow(BusinessRuleValidationException);
    expect(updateIndicatorBoardMetadataName).toThrow(rule.Message);
  });
});
