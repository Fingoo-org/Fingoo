import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetIndicatorsQuery } from './get-indicators.query';
import { LoadIndicatorsPort } from '../../../../port/persistence/indicator/load-indicators.port';
import { Indicator } from '../dto/indicator.dto';

@Injectable()
@QueryHandler(GetIndicatorsQuery)
export class GetIndicatorsQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadIndicatorsPort')
    private readonly loadIndicatorsPort: LoadIndicatorsPort,
  ) {}

  async execute(): Promise<Indicator[]> {
    const indicatorsDto = await this.loadIndicatorsPort.loadIndicators();
    return indicatorsDto.indicators;
  }
}
