import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class SearchSymbolDto {
  @ApiProperty({
    example: 'AA',
    description: '검색하려는 Symbol',
  })
  @IsString()
  @Type(() => String)
  readonly symbol: string;
}
