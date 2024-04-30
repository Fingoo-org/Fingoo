import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { SourceIndicatorInformation } from 'src/utils/type/type-definition';

export class UpdateSourceIndicatorsInformationDto {
  @ApiProperty({
    example: [
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120020',
        indicatorType: 'stock',
        weight: 70,
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120032',
        indicatorType: 'stock',
        weight: 0,
      },
    ],
  })
  @IsArray()
  sourceIndicatorsInformation: SourceIndicatorInformation[];
}
