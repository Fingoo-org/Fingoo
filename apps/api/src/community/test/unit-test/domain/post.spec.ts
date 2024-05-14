import { BusinessRuleValidationException } from 'src/utils/domain/business-rule-validation.exception';
import { Post } from '../../../domain/post';
import {
  CONTENT_LIMIT_RULE,
  PostContentLengthShouldNotExceedLimitRule,
} from 'src/community/domain/rule/PostContentLengthShouldNotExceedLimit.rule';

describe('포스트', () => {
  it('포스트를 게시한다', () => {
    // given

    // when
    const post = Post.createNew('포스팅 내용');

    // then
    const expected = new Post('포스팅 내용');
    expect(expected).toEqual(post);
  });

  it('포스트를 최대 글자수를 초과하여 게시한다', () => {
    //given
    const content = '*'.repeat(CONTENT_LIMIT_RULE + 1);

    //when
    function createPost() {
      Post.createNew(content);
    }
    const rule = new PostContentLengthShouldNotExceedLimitRule(content);

    //then
    expect(createPost).toThrow(BusinessRuleValidationException);
    expect(createPost).toThrow(rule.Message);
  });
});
