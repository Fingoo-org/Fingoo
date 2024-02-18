import { BusinessRule } from '../../../utils/domain/business.rule';

export class DeletedIndicatorTickerDoesNotExistRule implements BusinessRule {
  constructor(
    private readonly updateTickers: Record<string, string[]>,
    private readonly ticker: string,
  ) {}

  isBroken = () =>
    Object.keys(this.updateTickers).some((type) =>
      this.updateTickers[type].toString().split(',').includes(this.ticker),
    );
  get Message() {
    return `지표가 삭제되지 않았습니다.`;
  }
}
