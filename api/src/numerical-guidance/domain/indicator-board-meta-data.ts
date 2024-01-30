import { AggregateRoot } from 'src/building-blocks/domain/aggregate-root';
import { IndicatorBoardMetaDataRule } from './rule/IndicatorBoardMetaData.rule';

export class IndicatorBoardMetaData extends AggregateRoot {
  readonly indicatorBoardMetaDataName: string;
  readonly indicatorIds: Record<string, string[]>;
  readonly memberId: number;

  static createNew(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>, memberId: number) {
    return new IndicatorBoardMetaData(indicatorBoardMetaDataName, indicatorIds, memberId);
  }

  constructor(indicatorBoardMetaDataName: string, indicatorIds: Record<string, string[]>, memberId: number) {
    super();
    this.checkRule(new IndicatorBoardMetaDataRule(this.indicatorIds));
    this.indicatorBoardMetaDataName = indicatorBoardMetaDataName;
    this.memberId = memberId;
    this.indicatorIds = indicatorIds;
  }
}
