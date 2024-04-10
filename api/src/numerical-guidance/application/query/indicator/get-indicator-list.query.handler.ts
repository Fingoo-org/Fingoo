import { GetIndicatorListQuery } from './get-indicator-list.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { LoadIndicatorListPort } from '../../port/persistence/indicator/load-indicator-list.port';
import { BondsDto } from './dto/bonds.dto';
import { CursorPageDto } from '../../../../utils/pagination/cursor-page.dto';
import { CryptoCurrenciesDto } from './dto/crypto-currencies.dto';
import { ETFDto } from './dto/etf.dto';
import { ForexPairDto } from './dto/forex-pair.dto';
import { IndicesDto } from './dto/indices.dto';
import { StockDto } from './dto/stock.dto';
import { FundDto } from './dto/fund.dto';

@Injectable()
@QueryHandler(GetIndicatorListQuery)
export class GetIndicatorListQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorListPort')
    private readonly loadIndicatorListPort: LoadIndicatorListPort,
  ) {}

  async execute(
    query: GetIndicatorListQuery,
  ): Promise<CursorPageDto<CryptoCurrenciesDto | ETFDto | ForexPairDto | IndicesDto | StockDto | FundDto | BondsDto>> {
    const { type, cursorToken } = query;
    return this.loadIndicatorListPort.loadIndicatorList(type, cursorToken);
  }
}
