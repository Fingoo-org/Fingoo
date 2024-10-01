import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CONTENT_LIMIT_RULE } from '../../../domain/rule/PostContentLengthShouldNotExceedLimit.rule';

export class CreatePostRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTENT_LIMIT_RULE)
  readonly content: string;
}
