import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { IndicatorBoardMetadataCountShouldNotExceedLimitRule } from './rule/IndicatorBoardMetadataCountShouldNotExceedLimit.rule';
import { IndicatorBoardMetadataNameShouldNotEmptyRule } from './rule/IndicatorBoardMetadataNameShouldNotEmpty.rule';
import { IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule } from './rule/IndicatorInIndicatorBoardMetadataShouldNotDuplicate.rule';
import { OnlyRegisteredIdCanBeRemovedRule } from './rule/OnlyRegisteredIdCanBeRemoved.rule';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorIdInSectionsShouldBeInIndicatorRule } from './rule/IndicatorIdInSectionsShouldBeInIndicator.rule';
import { IndicatorType } from '../../utils/type/type-definition';

export type IndicatorInfo = {
  id: string;
  indicatorType: IndicatorType;
  name: string; // cryptocurrencies, forex_pairs -> currency_base 대체
  exchange: string; // cryptocurrencies -> currency_base, forex_pairs -> group 대체
};

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
  indicatorInfos: IndicatorInfo[];

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
    const initIndicatorIds: IndicatorInfo[] = [];
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

  public insertIndicatorId(indicatorIdInfo: IndicatorInfo): void {
    this.insertIndicatorInfoAndUpdateSections(indicatorIdInfo, this.indicatorInfos);
  }

  public insertCustomForecastIndicatorId(id: string): void {
    this.insertIdAndUpdateSections(id, this.customForecastIndicatorIds);
  }

  public deleteIndicatorId(id: string): void {
    this.deleteIndicatorInfoAndUpdateSections(id, this.indicatorInfos);
  }

  public deleteCustomForecastIndicatorId(id: string): void {
    this.deleteIdAndUpdateSections(id, this.customForecastIndicatorIds);
  }

  public updateSections(sections: Record<string, string[]>): void {
    this.checkRule(
      new IndicatorIdInSectionsShouldBeInIndicatorRule(
        this.getIdsFromIndicatorInfos(this.indicatorInfos),
        this.customForecastIndicatorIds,
        sections,
      ),
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
    const currentIds = this.convertIdsToArray(newIds);
    currentIds.push(id);
    newIds = currentIds;

    const newSections: Record<string, string[]> = { ...this.sections };
    const { currentSection, lastKey } = this.getCurrentSectionAndLastKey(newSections);
    currentSection.push(id);

    newSections[lastKey] = currentSection;
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(newIds));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(newSections));

    this.customForecastIndicatorIds = newIds;
    this.sections = newSections;
  }

  private insertIndicatorInfoAndUpdateSections(indicatorInfo: IndicatorInfo, indicatorIdInfos: IndicatorInfo[]): void {
    const newIndicatorInfos: IndicatorInfo[] = [...indicatorIdInfos];
    newIndicatorInfos.push(indicatorInfo);

    const newSections: Record<string, string[]> = { ...this.sections };
    const { currentSection, lastKey } = this.getCurrentSectionAndLastKey(newSections);
    currentSection.push(indicatorInfo.id);

    newSections[lastKey] = currentSection;
    this.checkRule(
      new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(this.getIdsFromIndicatorInfos(newIndicatorInfos)),
    );
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(newSections));

    this.indicatorInfos = newIndicatorInfos;
    this.sections = newSections;
  }

  private deleteIndicatorInfoAndUpdateSections(id: string, indicatorIdInfos: IndicatorInfo[]): void {
    let updateIndicatorInfos: IndicatorInfo[] = [...indicatorIdInfos];
    this.checkRule(new OnlyRegisteredIdCanBeRemovedRule(this.getIdsFromIndicatorInfos(indicatorIdInfos), id));
    updateIndicatorInfos = updateIndicatorInfos.filter((indicatorInfo) => indicatorInfo.id !== id);

    const sections: Record<string, string[]> = { ...this.sections };
    const updatedSections = this.removeIdFromSections(sections, id);

    this.indicatorInfos = updateIndicatorInfos;
    this.sections = updatedSections;
  }

  private deleteIdAndUpdateSections(id: string, ids: string[]): void {
    let updateIds: string[] = [...ids];
    this.checkRule(new OnlyRegisteredIdCanBeRemovedRule(updateIds, id));
    updateIds = updateIds.filter((value) => value !== id);

    const sections: Record<string, string[]> = { ...this.sections };
    const updatedSections = this.removeIdFromSections(sections, id);

    this.customForecastIndicatorIds = updateIds;
    this.sections = updatedSections;
  }

  private convertIdsToArray(indicatorIds: string[]): string[] {
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

  private getIdsFromIndicatorInfos(indicatorInfos: IndicatorInfo[]): string[] {
    return indicatorInfos.map((indicatorInfo) => {
      return indicatorInfo.id;
    });
  }

  constructor(
    id: string,
    indicatorBoardMetadataName: string,
    indicatorInfos: IndicatorInfo[],
    customForecastIndicatorIds: string[],
    sections: Record<string, string[]>,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.checkRule(new IndicatorBoardMetadataNameShouldNotEmptyRule(indicatorBoardMetadataName));
    this.checkRule(new IndicatorBoardMetadataCountShouldNotExceedLimitRule(sections));
    this.checkRule(
      new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(this.getIdsFromIndicatorInfos(indicatorInfos)),
    );
    this.checkRule(new IndicatorInIndicatorBoardMetadataShouldNotDuplicateRule(customForecastIndicatorIds));
    this.checkRule(
      new IndicatorIdInSectionsShouldBeInIndicatorRule(
        this.getIdsFromIndicatorInfos(indicatorInfos),
        customForecastIndicatorIds,
        sections,
      ),
    );
    this.id = id;
    this.indicatorBoardMetadataName = indicatorBoardMetadataName;
    this.indicatorInfos = indicatorInfos;
    this.customForecastIndicatorIds = customForecastIndicatorIds;
    this.sections = sections;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
