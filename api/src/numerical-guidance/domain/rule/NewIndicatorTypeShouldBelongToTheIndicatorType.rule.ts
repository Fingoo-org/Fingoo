import { BusinessRule } from '../../../utils/domain/business.rule';

const INDICATOR_TYPE = ['k-stock', 'exchange'];

export class NewIndicatorTypeShouldBelongToTheIndicatorTypeRule implements BusinessRule {
  constructor(private readonly tickers: Record<string, string[]>) {}

  isBroken = () => Object.keys(this.tickers).some((type) => !INDICATOR_TYPE.includes(type));
  get Message() {
    return `지표의 타입을 올바르게 입력해주세요.`;
  }
}
