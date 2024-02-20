import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { NewIndicatorTypeShouldBelongToTheIndicatorTypeRule } from './rule/NewIndicatorTypeShouldBelongToTheIndicatorType.rule';
import { OnlyRegisteredTickersCanBeRemovedRule } from './rule/OnlyRegisteredTickersCanBeRemoved.rule';

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

  public deleteIndicatorTicker(ticker: string) {
    const updateTickers: Record<string, string[]> = { ...this.tickers };
    this.checkRule(new OnlyRegisteredTickersCanBeRemovedRule(updateTickers, ticker));

    Object.keys(updateTickers).forEach((key) => {
      updateTickers[key] = this.convertToArray(updateTickers[key].toString()).filter((value) => value !== ticker);
    });
    this.tickers = updateTickers;
  }

  public updateIndicatorBoardMetaDataName(name: string) {
    this.checkRule(new IndicatorBoardMetaDataNameShouldNotEmptyRule(name));
    this.indicatorBoardMetaDataName = name;
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
