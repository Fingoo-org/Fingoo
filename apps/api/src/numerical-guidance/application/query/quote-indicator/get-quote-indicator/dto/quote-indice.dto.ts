import { BaseQuoteIndicatorDto } from './base-quote-indicator.dto';
import { ApiProperty } from '@nestjs/swagger';
import { QuoteIndicatorFiftyTwoWeekDto } from './quote-indicator.fify-two-week.dto';

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
    const quoteIndiceDto: QuoteIndiceDto = Object.assign(new QuoteIndiceDto(), data);
    quoteIndiceDto.fifty_two_week = new QuoteIndicatorFiftyTwoWeekDto(data.fifty_two_week);
    return quoteIndiceDto;
  }
}
