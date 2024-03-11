import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { OnlyRegisteredIdCanBeRemovedRule } from './rule/OnlyRegisteredIdCanBeRemoved.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  readonly id: string;
  indicatorBoardMetadataName: string;
  indicatorIds: string[];
  createdAt: Date;
  updatedAt: Date;

  static createNew(indicatorBoardMetadataName: string): IndicatorBoardMetadata {
    const initIndicatorIds: string[] = [];
    const currentDate = new Date();
    return new IndicatorBoardMetadata(null, indicatorBoardMetadataName, initIndicatorIds, currentDate, currentDate);
  }

  public insertIndicatorId(id: string): void {
    let newIndicatorIds: string[] = [...this.indicatorIds];
    const currentIndicatorIds = this.convertToArray(newIndicatorIds);
    currentIndicatorIds.push(id);
    newIndicatorIds = currentIndicatorIds;
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(newIndicatorIds));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(newIndicatorIds));
    this.indicatorIds = newIndicatorIds;
  }

  public deleteIndicatorId(id: string): void {
    let updateIds: string[] = [...this.indicatorIds];
    this.checkRule(new OnlyRegisteredIdCanBeRemovedRule(updateIds, id));

    updateIds = updateIds.filter((value) => value !== id);
    this.indicatorIds = updateIds;
  }

  public updateIndicatorBoardMetadataName(name: string) {
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(name));
    this.indicatorBoardMetadataName = name;
    this.updatedAt = new Date();
  }

  private convertToArray(indicatorIds: string[]): string[] {
    if (indicatorIds.length == 1 && indicatorIds[0] == '') {
      return [];
    }
    return indicatorIds;
  }

  constructor(
    id: string,
    indicatorBoardMetadataName: string,
    indicatorIds: string[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(indicatorBoardMetadataName));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(indicatorIds));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(indicatorIds));
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.indicatorIds = indicatorIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
