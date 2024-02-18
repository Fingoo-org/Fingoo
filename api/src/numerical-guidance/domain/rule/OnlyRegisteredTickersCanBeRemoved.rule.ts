import { BusinessRule } from '../../../utils/domain/business.rule';

export class OnlyRegisteredTickersCanBeRemovedRule implements BusinessRule {
  constructor(
    private readonly updateTickers: Record<string, string[]>,
    private readonly ticker: string,
  ) {}

  isBroken = () =>
    Object.keys(this.updateTickers).every(
      (type) => !this.updateTickers[type].toString().split(',').includes(this.ticker),
    );

  get Message() {
    return `등록되지 않는 지표입니다. 다시 확인해주세요.`;
  }
}
