import { BusinessRule } from 'src/utils/domain/business.rule';

export class TargetIndicatorIdShouldBeUUIDRule implements BusinessRule {
  constructor(private readonly targetIndicatorId: string) {}

  private readonly UUID_Pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  isBroken = () => this.UUID_Pattern.test(this.targetIndicatorId);

  get Message() {
    return '타겟지표 id형식은 UUID를 따라야 합니다.';
  }
}
