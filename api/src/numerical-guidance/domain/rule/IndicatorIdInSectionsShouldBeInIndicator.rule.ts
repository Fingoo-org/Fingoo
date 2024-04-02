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
    const allSectionValues = Object.values(this.sections).flat();
    const allValues = [...this.indicatorIds, ...this.customForecastIndicatorIds];
    return !this.hasAllValuesInSection(allSectionValues, allValues) || this.hasInvalidValuesInSection(allValues);
  }

  private hasAllValuesInSection(values: string[], allValues: string[]): boolean {
    return allValues.every((value) => values.some((v) => v === value));
  }

  private hasInvalidValuesInSection(allValues: string[]): boolean {
    return Object.values(this.sections).some((sectionValues) =>
      sectionValues.some((value) => !allValues.includes(value)),
    );
  }
}
