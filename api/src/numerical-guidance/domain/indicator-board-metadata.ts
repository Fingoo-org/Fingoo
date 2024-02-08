import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  readonly indicatorBoardMetaDataName: string;
  readonly indicatorIds: Record<string, string[]>;

  static createNew(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>) {
    return new IndicatorBoardMetadata(indicatorBoardMetaDataName, indicatorIds);
  }

  constructor(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>) {
    super();
    this.checkRule(new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(indicatorIds));
    this.checkRule(new IndicatorBoardMetaDataNameShouldNotEmptyRule(indicatorBoardMetaDataName));
    this.indicatorBoardMetaDataName = indicatorBoardMetaDataName;
    this.indicatorIds = indicatorIds;
  }
}
