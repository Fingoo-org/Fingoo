import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';

export class UpdateSectionsDto {
  @ApiProperty({
    example: {
      section1: ['160e5499-4925-4e38-bb00-8ea6d8056484'],
      section2: ['160e5499-4925-4e38-bb00-8ea6d8056483'],
    },
    description: '각 섹션의 값',
  })
  @IsNotEmptyObject()
  readonly sections: Record<string, string[]>;
}
