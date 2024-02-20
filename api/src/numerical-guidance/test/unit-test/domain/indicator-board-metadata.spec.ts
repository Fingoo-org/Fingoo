import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from '../../../domain/rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { BusinessRuleValidationException } from '../../../../utils/domain/business-rule-validation.exception';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from '../../../domain/rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from '../../../domain/rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { NewIndicatorTypeShouldBelongToTheIndicatorTypeRule } from '../../../domain/rule/NewIndicatorTypeShouldBelongToTheIndicatorType.rule';
import { OnlyRegisteredTickersCanBeRemovedRule } from '../../../domain/rule/OnlyRegisteredTickersCanBeRemoved.rule';

describe('지표보드 메타데이터', () => {
  it('지표보드 메타데이터 도메인 생성', () => {
    // given

    // when
    const indicatorBoardMetaData = IndicatorBoardMetadata.createNew('메타 데이터');

    // then
    const expected = new IndicatorBoardMetadata(null, '메타 데이터', { 'k-stock': [], exchange: [] });
    expect(expected).toEqual(indicatorBoardMetaData);
  });

  it('지표보드 메타데이터에 새로운 지표 ticker 추가', () => {
    // given
    const indicatorBoardMetaData = IndicatorBoardMetadata.createNew('name');
    const type = 'k-stock';
    const ticker = 'ticker1';

    // when
    indicatorBoardMetaData.insertIndicatorTicker(ticker, type);

    // then
    const expected = {
      'k-stock': ['ticker1'],
      exchange: [],
    };
    expect(expected).toEqual(indicatorBoardMetaData.tickers);
  });

  it('지표보드 메타데이터의 ticker 개수는 최대 5개를 넘을 수 없다.', () => {
    //given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1', 'ticker2', 'ticker3'],
      exchange: ['ticker4', 'ticker5'],
    });
    const type = 'k-stock';
    const ticker = 'ticker6';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetaData.insertIndicatorTicker(ticker, type);
    }
    const rule = new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(indicatorBoardMetaData.tickers);

    //then
    expect(insertIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 지표 ticker는 중복될 수 없다.', () => {
    //given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id2', 'name', {
      'k-stock': ['ticker1'],
      exchange: ['ticker4'],
    });
    const type = 'k-stock';
    const ticker = 'ticker1';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetaData.insertIndicatorTicker(ticker, type);
    }
    const rule = new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(indicatorBoardMetaData.tickers);

    //then
    expect(insertIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 지표 type 값이 잘못 들어온 경우', () => {
    //given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id3', 'name', {
      'k-stock': ['ticker1'],
      exchange: ['ticker4'],
    });
    const type = 'invalidType';
    const ticker = 'ticker3';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetaData.insertIndicatorTicker(ticker, type);
    }
    const rule = new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(indicatorBoardMetaData.tickers);

    //then
    expect(insertIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름은 비워질 수 없다. (빈 문자열인 경우)', () => {
    //given
    const content = '';

    //when
    function createNewIndicator() {
      IndicatorBoardMetadata.createNew(content);
    }
    const rule = new IndicatorBoardMetaDataNameShouldNotEmptyRule(content);

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
    const rule = new IndicatorBoardMetaDataNameShouldNotEmptyRule(content);

    //then
    expect(createNewIndicator).toThrow(BusinessRuleValidationException);
    expect(createNewIndicator).toThrow(rule.Message);
  });

  it('지표보드 메타데이터에서 지표 ticker 삭제', () => {
    // given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1', 'ticker2'],
      exchange: [],
    });
    const ticker = 'ticker1';

    // when
    indicatorBoardMetaData.deleteIndicatorTicker(ticker);

    // then
    const expected = {
      'k-stock': ['ticker2'],
      exchange: [],
    };
    expect(expected).toEqual(indicatorBoardMetaData.tickers);
  });

  it('지표보드 메타데이터에서 지표 ticker 삭제 - 등록되지 않은 지표 요청', () => {
    // given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });
    const ticker = 'invalidTicker';

    // when
    function deleteIndicatorTicker() {
      indicatorBoardMetaData.deleteIndicatorTicker(ticker);
    }
    const rule = new OnlyRegisteredTickersCanBeRemovedRule(indicatorBoardMetaData.tickers, ticker);

    //then
    expect(deleteIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(deleteIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름을 수정한다. ', () => {
    // given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });

    // when
    indicatorBoardMetaData.updateIndicatorBoardMetaDataName('updateName');
    const expected = 'updateName';

    //then
    expect(expected).toEqual(indicatorBoardMetaData.indicatorBoardMetaDataName);
  });

  it('지표보드 메타데이터의 이름을 수정한다. ', () => {
    // given
    const indicatorBoardMetaData = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });
    const invalidName = '';

    // when
    function updateIndicatorBoardMetaDataName() {
      indicatorBoardMetaData.updateIndicatorBoardMetaDataName(invalidName);
    }
    const rule = new IndicatorBoardMetaDataNameShouldNotEmptyRule(invalidName);

    //then
    expect(updateIndicatorBoardMetaDataName).toThrow(BusinessRuleValidationException);
    expect(updateIndicatorBoardMetaDataName).toThrow(rule.Message);
  });
});
