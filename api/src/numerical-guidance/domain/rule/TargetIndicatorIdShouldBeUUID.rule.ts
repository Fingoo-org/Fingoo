import { BusinessRule } from 'src/utils/domain/business.rule';

export class TargetIndicatorIdShouldBeUUIDRule implements BusinessRule {
  constructor(private readonly TargetIndicatorId: string) {}

  isBroken = () =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(this.TargetIndicatorId);

  get Message() {
    return '타겟지표 id형식은 UUID를 따라야 합니다.';
  }
}
