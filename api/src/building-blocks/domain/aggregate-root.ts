import { AggregateRoot } from '@nestjs/cqrs';
import { BusinessRule } from './business.rule';
import { BusinessRuleValidationException } from './business-rule-validation.exception';

abstract class CustomAggregateRoot extends AggregateRoot {
  checkRule(rule: BusinessRule) {
    if (rule.isBroken()) {
      throw new BusinessRuleValidationException(rule);
    }
  }
}

export { CustomAggregateRoot as AggregateRoot };
