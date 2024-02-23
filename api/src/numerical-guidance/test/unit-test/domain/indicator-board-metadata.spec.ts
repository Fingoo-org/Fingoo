import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from '../../../domain/rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { BusinessRuleValidationException } from '../../../../utils/domain/business-rule-validation.exception';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from '../../../domain/rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from '../../../domain/rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { NewIndicatorTypeShouldBelongToTheIndicatorTypeRule } from '../../../domain/rule/NewIndicatorTypeShouldBelongToTheIndicatorType.rule';
import { OnlyRegisteredTickersCanBeRemovedRule } from '../../../domain/rule/OnlyRegisteredTickersCanBeRemoved.rule';

describe('지표보드 메타데이터', () => {
  it('지표보드 메타데이터 도메인 생성', () => {
    // given

    // when
    const indicatorBoardMetadataName = IndicatorBoardMetadata.createNew('메타 데이터');

    // then
    const expected = new IndicatorBoardMetadata(null, '메타 데이터', { 'k-stock': [], exchange: [] });
    expect(expected).toEqual(indicatorBoardMetadataName);
  });

  it('지표보드 메타데이터에 새로운 지표 ticker 추가', () => {
    // given
    const indicatorBoardMetadataName = IndicatorBoardMetadata.createNew('name');
    const type = 'k-stock';
    const ticker = 'ticker1';

    // when
    indicatorBoardMetadataName.insertIndicatorTicker(ticker, type);

    // then
    const expected = {
      'k-stock': ['ticker1'],
      exchange: [],
    };
    expect(expected).toEqual(indicatorBoardMetadataName.tickers);
  });

  it('지표보드 메타데이터의 ticker 개수는 최대 5개를 넘을 수 없다.', () => {
    //given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1', 'ticker2', 'ticker3'],
      exchange: ['ticker4', 'ticker5'],
    });
    const type = 'k-stock';
    const ticker = 'ticker6';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetadataName.insertIndicatorTicker(ticker, type);
    }
    const rule = new IndicatorBoardMetadataCountShouldNotExceedLimitRule(indicatorBoardMetadataName.tickers);

    //then
    expect(insertIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 지표 ticker는 중복될 수 없다.', () => {
    //given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id2', 'name', {
      'k-stock': ['ticker1'],
      exchange: ['ticker4'],
    });
    const type = 'k-stock';
    const ticker = 'ticker1';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetadataName.insertIndicatorTicker(ticker, type);
    }
    const rule = new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(indicatorBoardMetadataName.tickers);

    //then
    expect(insertIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(insertIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 지표 type 값이 잘못 들어온 경우', () => {
    //given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id3', 'name', {
      'k-stock': ['ticker1'],
      exchange: ['ticker4'],
    });
    const type = 'invalidType';
    const ticker = 'ticker3';

    //when
    function insertIndicatorTicker() {
      indicatorBoardMetadataName.insertIndicatorTicker(ticker, type);
    }
    const rule = new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(indicatorBoardMetadataName.tickers);

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

  it('지표보드 메타데이터에서 지표 ticker 삭제', () => {
    // given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1', 'ticker2'],
      exchange: [],
    });
    const ticker = 'ticker1';

    // when
    indicatorBoardMetadataName.deleteIndicatorTicker(ticker);

    // then
    const expected = {
      'k-stock': ['ticker2'],
      exchange: [],
    };
    expect(expected).toEqual(indicatorBoardMetadataName.tickers);
  });

  it('지표보드 메타데이터에서 지표 ticker 삭제 - 등록되지 않은 지표 요청', () => {
    // given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });
    const ticker = 'invalidTicker';

    // when
    function deleteIndicatorTicker() {
      indicatorBoardMetadataName.deleteIndicatorTicker(ticker);
    }
    const rule = new OnlyRegisteredTickersCanBeRemovedRule(indicatorBoardMetadataName.tickers, ticker);

    //then
    expect(deleteIndicatorTicker).toThrow(BusinessRuleValidationException);
    expect(deleteIndicatorTicker).toThrow(rule.Message);
  });

  it('지표보드 메타데이터의 이름을 수정한다. ', () => {
    // given
    const indicatorBoardMetadataName = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });

    // when
    indicatorBoardMetadataName.updateIndicatorBoardMetadataName('updateName');
    const expected = 'updateName';

    //then
    expect(expected).toEqual(indicatorBoardMetadataName.indicatorBoardMetadataName);
  });

  it('지표보드 메타데이터의 이름을 수정한다. - 이름이 비어있을 때 ', () => {
    // given
    const indicatorBoardMetadata = new IndicatorBoardMetadata('id1', 'name', {
      'k-stock': ['ticker1'],
      exchange: [],
    });
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
