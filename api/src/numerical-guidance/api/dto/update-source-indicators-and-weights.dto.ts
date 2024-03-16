import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { SourceIndicatorIdAndWeightType } from 'src/utils/type/type-definition';

export class UpdateSourceIndicatorsAndWeightsDto {
  @ApiProperty({
    example: [
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120020',
        weight: '0.07',
      },
      {
        sourceIndicatorId: '26929514-237c-11ed-861d-0242ac120032',
        weight: 'none',
      },
    ],
  })
  @IsArray()
  sourceIndicatorIdsAndWeights: SourceIndicatorIdAndWeightType[];
}
