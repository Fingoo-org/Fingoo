import { IndicatorType } from '../../../../../utils/type/type-definition';
import { CryptoCurrenciesDto } from '../../../query/indicator/get-indicator-list/dto/crypto-currencies.dto';
import { ETFDto } from '../../../query/indicator/get-indicator-list/dto/etf.dto';
import { ForexPairDto } from '../../../query/indicator/get-indicator-list/dto/forex-pair.dto';
import { IndicesDto } from '../../../query/indicator/get-indicator-list/dto/indices.dto';
import { StockDto } from '../../../query/indicator/get-indicator-list/dto/stock.dto';
import { FundDto } from '../../../query/indicator/get-indicator-list/dto/fund.dto';
import { BondsDto } from '../../../query/indicator/get-indicator-list/dto/bonds.dto';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(
    type: IndicatorType,
    cursorToken: number,
  ): Promise<CursorPageDto<CryptoCurrenciesDto | ETFDto | ForexPairDto | IndicesDto | StockDto | FundDto | BondsDto>>;
}
