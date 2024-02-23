import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { NewIndicatorTypeShouldBelongToTheIndicatorTypeRule } from './rule/NewIndicatorTypeShouldBelongToTheIndicatorType.rule';
import { OnlyRegisteredTickersCanBeRemovedRule } from './rule/OnlyRegisteredTickersCanBeRemoved.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  readonly id: string;
  indicatorBoardMetadataName: string;
  tickers: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;

  static createNew(indicatorBoardMetadataName: string): IndicatorBoardMetadata {
    const initTickers: Record<string, string[]> = { 'k-stock': [], exchange: [] };
    return new IndicatorBoardMetadata(null, indicatorBoardMetadataName, initTickers);
  }

  public insertIndicatorTicker(ticker: string, type: string): void {
    const newTickers: Record<string, string[]> = { ...this.tickers };
    const currentTickers = this.convertToArray(newTickers[type]?.toString());
    currentTickers.push(ticker);
    newTickers[type] = currentTickers;
    this.checkRule(new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(newTickers));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(newTickers));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(newTickers));
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

  public updateIndicatorBoardMetadataName(name: string) {
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(name));
    this.indicatorBoardMetadataName = name;
    this.updatedAt = new Date();
  }

  private convertToArray(tickers: string): string[] {
    if (tickers) {
      return tickers.split(',');
    }
    return [];
  }

  constructor(id: string, indicatorBoardMetadataName: string, tickers: Record<string, string[]>) {
    super();
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(indicatorBoardMetadataName));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(tickers));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(tickers));
    this.checkRule(new NewIndicatorTypeShouldBelongToTheIndicatorTypeRule(tickers));
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.tickers = tickers;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
