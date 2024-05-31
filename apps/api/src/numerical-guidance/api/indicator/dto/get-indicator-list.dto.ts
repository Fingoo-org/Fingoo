import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '../../../../utils/type/type-definition';
import { Type } from 'class-transformer';
import { IsIndicatorType } from '../../../../utils/validation/is.indicator-type.validation';

export class GetIndicatorListDto {
  @ApiProperty({
    example: 'stocks',
    description: '지표 type',
  })
  @IsString()
  @IsIndicatorType()
  readonly type: IndicatorType;

  @ApiProperty({
    example: 1,
    description: '페이지네이션 cursor ID',
  })
  @IsNumber()
  @Type(() => Number)
  readonly cursorToken: number;
}
