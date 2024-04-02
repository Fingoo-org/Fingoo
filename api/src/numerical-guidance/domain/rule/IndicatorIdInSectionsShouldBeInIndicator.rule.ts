import { BusinessRule } from 'src/utils/domain/business.rule';

export class IndicatorIdInSectionsShouldBeInIndicatorRule implements BusinessRule {
  constructor(
    private readonly indicatorIds: string[],
    private readonly customForecastIndicatorIds: string[],
    private readonly sections: Record<string, string[]>,
  ) {}

  isBroken = () => this.hasInvalidDataInSections();

  get Message() {
    return '지표의 값과 축에 들어있는 지표 값이 일치하지 않습니다.';
  }

  public hasInvalidDataInSections(): boolean {
    const allSectionIds = Object.values(this.sections).flat();
    const allIds = [...this.indicatorIds, ...this.customForecastIndicatorIds];
    return !this.hasAllValuesInSection(allSectionIds, allIds) || this.hasInvalidValuesInSection(allIds);
  }

  private hasAllValuesInSection(ids: string[], allValues: string[]): boolean {
    return allValues.every((id) => ids.some((v) => v === id));
  }

  private hasInvalidValuesInSection(allIds: string[]): boolean {
    return Object.values(this.sections).some((sectionIds) => sectionIds.some((id) => !allIds.includes(id)));
  }
}
