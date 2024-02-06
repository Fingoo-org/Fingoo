import { AggregateRoot } from 'src/utils/building-blocks/domain/aggregate-root';
import { IndicatorBoardMetaDataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetaDataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetaDataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetaDataNameShouldNotEmpty.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  readonly indicatorBoardMetaDataName: string;
  readonly indicatorIds: Record<string, string[]>;
  readonly memberId: number;

  static createNew(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>, memberId: number) {
    return new IndicatorBoardMetadata(indicatorBoardMetaDataName, indicatorIds, memberId);
  }

  constructor(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>, memberId: number) {
    super();
    this.checkRule(new IndicatorBoardMetaDataCountShouldNotExceedLimitRule(indicatorIds));
    this.checkRule(new IndicatorBoardMetaDataNameShouldNotEmptyRule(indicatorBoardMetaDataName));
    this.indicatorBoardMetaDataName = indicatorBoardMetaDataName;
    this.memberId = memberId;
    this.indicatorIds = indicatorIds;
  }
}
