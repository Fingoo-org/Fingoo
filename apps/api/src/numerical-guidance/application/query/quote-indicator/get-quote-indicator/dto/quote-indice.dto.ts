import { BaseQuoteIndicatorDto } from './base-quote-indicator.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteIndiceDto extends BaseQuoteIndicatorDto {
  @ApiProperty({
    example: 'XNGS',
    description: '거래소 코드',
  })
  mic_code: string;

  @ApiProperty({
    example: 'USD',
    description: '통화',
  })
  currency: string;

  @ApiProperty({
    example: '5531150000',
    description: '거래량 (일정 기간동안의 거래량)',
  })
  volume: string;

  @ApiProperty({
    example: '5202505000',
    description: '평균 거래량 (일정 기간동안의 평균거래량)',
  })
  average_volume: string;

  static create(data: QuoteIndiceDto): QuoteIndiceDto {
    return Object.assign(new QuoteIndiceDto(), data);
  }
}
