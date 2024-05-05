import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'gangho324@naver.com',
    description: '이메일',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'pw',
    description: 'password',
  })
  @IsString()
  password: string;
}
