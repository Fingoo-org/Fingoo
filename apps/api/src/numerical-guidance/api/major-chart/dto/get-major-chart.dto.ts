import { ApiProperty } from '@nestjs/swagger';
import ChartTimeline from './chart-timeline.dto';

export class GetMajorChartDto {
  @ApiProperty({
    example: 'US',
    description: '국가 코드 (2자리)',
  })
  readonly country: string;

  @ApiProperty({
    example: 'S&P500',
    description: '지표 이름',
  })
  readonly symbolName: string;

  @ApiProperty({
    example: '40842.79',
    description: '지표의 현재 수치',
  })
  readonly symbolPrice: number;

  @ApiProperty({
    example: '0.24',
    description: '어제 대비 변동량',
  })
  readonly symbolChanges: number;

  @ApiProperty({
    example: [],
    description: '시간별 지표 값',
    type: ChartTimeline,
    isArray: true,
  })
  readonly timeline: ChartTimeline[];
}
