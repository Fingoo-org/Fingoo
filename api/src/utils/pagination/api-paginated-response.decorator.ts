import { CursorPageDto } from './cursor-page.dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { StockDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/stock.dto';
import { ETFDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/etf.dto';
import { ForexPairDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/forex-pair.dto';
import { FundDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/fund.dto';
import { IndicesDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/indices.dto';
import { BondsDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/bonds.dto';
import { CryptoCurrenciesDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/crypto-currencies.dto';

export const ApiPaginatedResponseDecorator = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(CursorPageDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(CursorPageDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: {
                  oneOf: [
                    { $ref: getSchemaPath(StockDto) },
                    { $ref: getSchemaPath(ETFDto) },
                    { $ref: getSchemaPath(ForexPairDto) },
                    { $ref: getSchemaPath(FundDto) },
                    { $ref: getSchemaPath(IndicesDto) },
                    { $ref: getSchemaPath(BondsDto) },
                    { $ref: getSchemaPath(CryptoCurrenciesDto) },
                  ],
                },
              },
            },
          },
        ],
      },
    }),
  );
};
