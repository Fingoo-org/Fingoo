import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { Public } from '../../../auth/util/is-public.decorator';
import { QuoteStockDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-stock.dto';
import { QuoteForexPairDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-forex-pair.dto';
import { QuoteCryptoCurrencyDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-crypto-currency.dto';
import { QuoteEtfDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-etf.dto';
import { QuoteIndiceDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-indice.dto';
import { QuoteFundDto } from '../../application/query/quote-indicator/get-quote-indicator/dto/quote-fund.dto';
import { GetQuoteIndicatorDto } from './dto/get-quote-indicator.dto';
import { IndicatorQuoteData } from '../../application/query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { GetQuoteIndicatorQuery } from '../../application/query/quote-indicator/get-quote-indicator/get-quote-indicator.query';
import { QuoteIndicatorIntervalEnum } from '../../../utils/enum/enum-definition';

@ApiTags('QuoteIndicatorController')
@Controller('/api/numerical-guidance')
export class QuoteIndicatorController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: '금융 상품의 견적 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '주식 데이터', type: QuoteStockDto })
  @ApiResponse({ status: 200, description: '외환 데이터', type: QuoteForexPairDto })
  @ApiResponse({ status: 200, description: '암호화폐 데이터', type: QuoteCryptoCurrencyDto })
  @ApiResponse({ status: 200, description: 'ETF 데이터', type: QuoteEtfDto })
  @ApiResponse({ status: 200, description: '지수 데이터', type: QuoteIndiceDto })
  @ApiResponse({ status: 200, description: '펀드 데이터', type: QuoteFundDto })
  @ApiExceptionResponse(400, 'message123', '[ERROR]123')
  @ApiExceptionResponse(404, 'message', '[ERROR]')
  @Public()
  @Get('/indicator/quote')
  async getQuote(@Query() getQuoteIndicatorDto: GetQuoteIndicatorDto): Promise<IndicatorQuoteData> {
    const {
      indicatorId,
      symbol,
      indicatorType,
      volume_time_period = '9',
      figi,
      mic_code,
      eod,
      interval = QuoteIndicatorIntervalEnum.DAY1,
    } = getQuoteIndicatorDto;
    const query = new GetQuoteIndicatorQuery(
      indicatorId,
      symbol,
      indicatorType,
      volume_time_period,
      figi,
      mic_code,
      eod,
      interval,
    );
    return this.queryBus.execute(query);
  }
}
