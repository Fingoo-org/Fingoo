import { IBusinessRule } from 'src/building-blocks/domain/ibusiness.rule';

export const CONTENT_LIMIT_RULE = 5000;

export class PostContentLengthShouldNotExceedLimitRule
  implements IBusinessRule
{
  constructor(private readonly content: string) {}

  IsBroken = () => this.content.length > CONTENT_LIMIT_RULE;

  get Message() {
    return `글자수는 최대 ${CONTENT_LIMIT_RULE} 자를 넘길 수 없습니다`;
  }
}
