import { ApiProperty } from '@nestjs/swagger';

export default class ChartTimeline {
  @ApiProperty({
    example: '2024-09-06 15:55:00',
    description: '시간',
  })
  time: string;

  @ApiProperty({
    example: '값',
    description: '401.38',
  })
  value: number;
}
