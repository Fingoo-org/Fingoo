import { AggregateRoot } from '../../utils/domain/aggregate-root';
import { ApiProperty } from '@nestjs/swagger';
import ChartTimeline from '../api/major-chart/dto/char-timeline.dto';

export class MajorChart extends AggregateRoot {
  @ApiProperty({
    example: 'USD',
    description: '화폐',
  })
  readonly currency: string;

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
  })
  readonly timeline: ChartTimeline[];

  constructor(
    currency: string,
    symbolName: string,
    symbolPrice: number,
    symbolChanges: number,
    timeline: ChartTimeline[],
  ) {
    super();
    this.currency = currency;
    this.symbolName = symbolName;
    this.symbolPrice = symbolPrice;
    this.symbolChanges = symbolChanges;
    this.timeline = timeline;
  }
}
