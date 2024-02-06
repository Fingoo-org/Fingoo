import { AggregateRoot } from 'src/utils/building-blocks/domain/aggregate-root';
import { PostContentLengthShouldNotExceedLimitRule } from './rule/PostContentLengthShouldNotExceedLimit.rule';

export class Post extends AggregateRoot {
  static createNew(content: string) {
    return new Post(content);
  }

  constructor(readonly content: string) {
    super();
    this.checkRule(new PostContentLengthShouldNotExceedLimitRule(this.content));
  }
}
