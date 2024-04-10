import { IndicatorType } from '../../../../../utils/type/type-definition';
import { CryptoCurrenciesDto } from '../../../query/indicator/dto/crypto-currencies.dto';
import { ETFDto } from '../../../query/indicator/dto/etf.dto';
import { ForexPairDto } from '../../../query/indicator/dto/forex-pair.dto';
import { IndicesDto } from '../../../query/indicator/dto/indices.dto';
import { StockDto } from '../../../query/indicator/dto/stock.dto';
import { FundDto } from '../../../query/indicator/dto/fund.dto';
import { BondsDto } from '../../../query/indicator/dto/bonds.dto';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(
    type: IndicatorType,
    cursorToken: number,
  ): Promise<CursorPageDto<CryptoCurrenciesDto | ETFDto | ForexPairDto | IndicesDto | StockDto | FundDto | BondsDto>>;
}
