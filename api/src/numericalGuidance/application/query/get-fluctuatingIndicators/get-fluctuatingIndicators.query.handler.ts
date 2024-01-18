import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetFluctuatingIndicatorsQuery } from './get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from './fluctuatingIndicators.dto';
import { LoadFluctuatingIndicatorsPort } from '../../port/external/load-fluctuatingIndicators.port';
import { LoadCachedFluctuatingIndicatorsPort } from '../../port/cache/load-cached-fluctuatingIndicators.port';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorsQuery)
export class GetFluctuatingIndicatorsQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadFluctuatingIndicatorsPort')
    private readonly loadFluctuatingIndicatorsPort: LoadFluctuatingIndicatorsPort,
    @Inject('LoadCachedFluctuatingIndicatorsPort')
    private readonly loadCachedFluctuatingIndicatorsPort: LoadCachedFluctuatingIndicatorsPort,
  ) {}

  async execute(): Promise<FluctuatingIndicatorsDto[]> {
    const fluctuatingIndicatorsDto: FluctuatingIndicatorsDto[] =
      await this.loadCachedFluctuatingIndicatorsPort.loadCachedFluctuatingIndicators();
    if (fluctuatingIndicatorsDto == null) {
      return await this.loadFluctuatingIndicatorsPort.loadFluctuatingIndicators();
    }
    return fluctuatingIndicatorsDto;
  }
}
