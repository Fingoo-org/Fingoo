import { BusinessRule } from 'src/utils/domain/business.rule';

export class CustomForecastIndicatorNameShouldNotEmptyRule implements BusinessRule {
  constructor(private readonly customForecastIndicatorName: string) {}

  isBroken = () =>
    this.customForecastIndicatorName === '' ||
    this.customForecastIndicatorName.trim() === '' ||
    this.customForecastIndicatorName.length === 0 ||
    !this.customForecastIndicatorName;

  get Message() {
    return '예측지표의 이름은 비워둘 수 없습니다.';
  }
}
