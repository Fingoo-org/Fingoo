import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CONTENT_LIMIT_RULE } from '../../../domain/rule/PostContentLengthShouldNotExceedLimit.rule';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostRequestDto {
  @ApiProperty({
    example:
      '“그래서 최저임금 얼마나 인상돼야 해?”는 저자기 이 책을 집필하면서 가장 많이 들은 질문이다. ' +
      '최저임금 인상 결과에 따라 근로자와 고용자는 서로를 향한 전쟁과도 같은 분노를 쏟아낸다. ' +
      '저자 김도경은 최저임금 인상 혹은 인하의 효과를 분석하는 것에 그치지 않고, 최저임금 전쟁의 본질과 논의의 요점, ' +
      '더불어 딜레마에 빠진 최저임금 전쟁에 대한 해답을 쉽게 파악할 수 있게 책을 구성했다. ' +
      '이 책은 단순한 최저임금 전쟁 설명서를 넘어서, 거대한 흐름에서 최저임금과 경제의 뼈대를 이해할 수 있는 기회가 될 것이다.',
    description: '게시글 내용',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CONTENT_LIMIT_RULE)
  readonly content: string;
}
