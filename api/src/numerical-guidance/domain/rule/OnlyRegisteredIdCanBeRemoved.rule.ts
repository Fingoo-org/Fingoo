import { BusinessRule } from '../../../utils/domain/business.rule';

export class OnlyRegisteredIdCanBeRemovedRule implements BusinessRule {
  constructor(
    private readonly updateIds: string[],
    private readonly id: string,
  ) {}

  isBroken = () => !this.updateIds.includes(this.id);

  get Message() {
    return `등록되지 않는 지표입니다. 다시 확인해주세요.`;
  }
}
