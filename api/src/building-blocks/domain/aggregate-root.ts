import { AggregateRoot } from '@nestjs/cqrs';
import { IBusinessRule } from './ibusiness.rule';
import { BusinessRuleValidationException } from './business-rule-validation.exception';

abstract class CustomAggregateRoot extends AggregateRoot {
  checkRule(rule: IBusinessRule) {
    if (rule.IsBroken()) {
      throw new BusinessRuleValidationException(rule);
    }
  }
}

export { CustomAggregateRoot as AggregateRoot };
