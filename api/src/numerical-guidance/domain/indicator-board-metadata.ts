import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { NewIndicatorTypeShouldBelongToTheIndicatorTypeRule } from './rule/NewIndicatorTypeShouldBelongToTheIndicatorType.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  readonly id: string;
  indicatorBoardMetaDataName: string;
  tickers: Record<string, string[]>;

  static createNew(indicatorBoardMetaDataName: string): IndicatorBoardMetadata {
    const initTickers: Record<string, string[]> = { 'k-stock': [], exchange: [] };
    return new IndicatorBoardMetadata(null, indicatorBoardMetaDataName, initTickers);
  }

  public insertIndicatorTicker(ticker: string, type: string): void {
    const newTickers: Record<string, string[]> = { ...this.tickers };
    const currentTickers = this.convertToArray(newTickers[type]?.toString());
    currentTickers.push(ticker);
    newTickers[type] = currentTickers;
    this.checkRule(new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(newTickers));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(newTickers));
    this.checkRule(new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(newTickers));
    this.tickers = newTickers;
  }

  private convertToArray(tickers: string): string[] {
    if (tickers) {
      return tickers.split(',');
    }
    return [];
  }

  constructor(id: string, indicatorBoardMetaDataName: string, tickers: Record<string, string[]>) {
    super();
    this.checkRule(new IndicatorBoardMetaDataNameShouldNotEmptyRule(indicatorBoardMetaDataName));
    this.checkRule(new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(tickers));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(tickers));
    this.checkRule(new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(tickers));
    this.id = id;
    this.indicatorBoardMetaDataName = indicatorBoardMetaDataName;
    this.tickers = tickers;
  }
}
