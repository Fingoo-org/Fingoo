import { HttpException } from '@nestjs/common';
import { IBusinessRule } from './ibusiness.rule';

type ErrorName = 'BUSINESS_RULE_BREAK';

//TODO 커스텀 예외와 에러처리 구현
export class BusinessRuleValidationException extends HttpException {
  name: ErrorName;

  constructor(rule: IBusinessRule) {
    super(rule.Message, 400);
  }
}
