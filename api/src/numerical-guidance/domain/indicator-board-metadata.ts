import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { OnlyRegisteredIdCanBeRemovedRule } from './rule/OnlyRegisteredIdCanBeRemoved.rule';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorIdInSectionsShouldBeInIndicatorRule } from './rule/IndicatorIdInSectionsShouldBeInIndicator.rule';

export class IndicatorBoardMetadata extends AggregateRoot {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '지표 보드 메티데이터 id',
  })
  readonly id: string;

  @ApiProperty({
    example: 'name',
    description: '지표 보드 메티데이터 name',
  })
  indicatorBoardMetadataName: string;

  @ApiProperty({
    example: ['c6a99067-27d0-4358-b3d5-e63a64b604c0', 'c6a99067-27d0-4358-b3d5-e63a64b604c3'],
    description: '지표 id 모음',
  })
  indicatorIds: string[];

  @ApiProperty({
    example: ['c6a99067-27d0-4358-b3d5-e63a64b604c1', 'c6a99067-27d0-4358-b3d5-e63a64b604c7'],
    description: '예측지표 id 모음',
  })
  customForecastIndicatorIds: string[];

  @ApiProperty({
    example: { section1: ['c6a99067-27d0-4358-b3d5-e63a64b604c1'], section2: ['c6a99067-27d0-4358-b3d5-e63a64b604c7'] },
    description: '지표 축 정보 (section)',
  })
  sections: Record<string, string[]>;

  @ApiProperty({
    example: '2024-03-04T05:17:33.756Z',
    description: '지표 보드 메티데이터 생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-04T05:17:33.756Z',
    description: '지표 보드 메티데이터 수정일',
  })
  updatedAt: Date;

  static createNew(indicatorBoardMetadataName: string): IndicatorBoardMetadata {
    const initIndicatorIds: string[] = [];
    const initCustomForecastIndicatorIds: string[] = [];
    const initSections: Record<string, string[]> = { section1: [] };
    const currentDate: Date = new Date();
    return new IndicatorBoardMetadata(
      null,
      indicatorBoardMetadataName,
      initIndicatorIds,
      initCustomForecastIndicatorIds,
      initSections,
      currentDate,
      currentDate,
    );
  }

  public insertIndicatorId(id: string): void {
    this.insertIdAndUpdateSections(id, this.indicatorIds);
  }

  public insertCustomForecastIndicatorId(id: string): void {
    this.insertIdAndUpdateSections(id, this.customForecastIndicatorIds);
  }

  public deleteIndicatorId(id: string): void {
    this.deleteIdAndUpdateSections(id, this.indicatorIds);
  }

  public deleteCustomForecastIndicatorId(id: string): void {
    this.deleteIdAndUpdateSections(id, this.customForecastIndicatorIds);
  }

  public updateSections(sections: Record<string, string[]>): void {
    this.checkRule(
      new IndicatorIdInSectionsShouldBeInIndicatorRule(this.indicatorIds, this.customForecastIndicatorIds, sections),
    );
    this.sections = sections;
  }

  public updateIndicatorBoardMetadataName(name: string) {
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(name));
    this.indicatorBoardMetadataName = name;
    this.updatedAt = new Date();
  }

  private insertIdAndUpdateSections(id: string, ids: string[]): void {
    let newIds: string[] = [...ids];
    const currentIds = this.convertToArray(newIds);
    currentIds.push(id);
    newIds = currentIds;

    const newSections: Record<string, string[]> = { ...this.sections };
    const { currentSection, lastKey } = this.getCurrentSectionAndLastKey(newSections);
    currentSection.push(id);

    newSections[lastKey] = currentSection;
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(newIds));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(newSections));

    ids === this.indicatorIds ? (this.indicatorIds = newIds) : (this.customForecastIndicatorIds = newIds);
    this.sections = newSections;
  }

  private deleteIdAndUpdateSections(id: string, ids: string[]): void {
    let updateIds: string[] = [...ids];
    this.checkRule(new OnlyRegisteredIdCanBeRemovedRule(updateIds, id));
    updateIds = updateIds.filter((value) => value !== id);

    const sections: Record<string, string[]> = { ...this.sections };
    const updatedSections = this.removeIdFromSections(sections, id);

    ids === this.indicatorIds ? (this.indicatorIds = updateIds) : (this.customForecastIndicatorIds = updateIds);
    this.sections = updatedSections;
  }

  private convertToArray(indicatorIds: string[]): string[] {
    if (indicatorIds.length == 1 && indicatorIds[0] == '') {
      return [];
    }
    return indicatorIds;
  }

  private getCurrentSectionAndLastKey(newSections: Record<string, string[]>) {
    const keys = Object.keys(newSections);
    const lastKey = keys[keys.length - 1];
    const currentSection = newSections[lastKey] ?? [];
    return { currentSection, lastKey };
  }

  private removeIdFromSections(data: Record<string, string[]>, targetId: string): Record<string, string[]> {
    return Object.entries(data).reduce(
      (resultSections, [key, values]) => {
        resultSections[key] = values.filter((id) => id !== targetId);
        return resultSections;
      },
      {} as Record<string, string[]>,
    );
  }

  constructor(
    id: string,
    indicatorBoardMetadataName: string,
    indicatorIds: string[],
    customForecastIndicatorIds: string[],
    sections: Record<string, string[]>,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(indicatorBoardMetadataName));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(sections));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(indicatorIds));
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(customForecastIndicatorIds));
    this.checkRule(
      new IndicatorIdInSectionsShouldBeInIndicatorRule(indicatorIds, customForecastIndicatorIds, sections),
    );
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.indicatorIds = indicatorIds;
    this.customForecastIndicatorIds = customForecastIndicatorIds;
    this.sections = sections;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
