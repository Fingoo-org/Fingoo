import { BaseQuoteIndicatorDto } from './base-quote-indicator.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteStockDto extends BaseQuoteIndicatorDto {
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
    example: '52958500',
    description: '거래량 (일정 기간동안의 거래량)',
  })
  volume: string;

  @ApiProperty({
    example: '39757870',
    description: '평균 거래량 (일정 기간동안의 평균거래량)',
  })
  average_volume: string;

  static create(data: QuoteStockDto): QuoteStockDto {
    return Object.assign(new QuoteStockDto(), data);
  }
}
