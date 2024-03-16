import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSourceIndicatorsAndWeightsPort } from '../../port/persistence/custom-forecast-indicator/update-source-indicators-and-weights.port';
import { UpdateSourceIndicatorsAndWeightsCommand } from './update-source-indicators-and-weights.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { Transactional } from 'typeorm-transactional';
import { LoadCustomForecastIndicatorPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';

@Injectable()
@CommandHandler(UpdateSourceIndicatorsAndWeightsCommand)
export class UpdateSourceIndicatorsAndWeightsCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateSourceIndicatorsAndWeightsPort')
    private readonly updateSourceIndicatorsAndWeightsPort: UpdateSourceIndicatorsAndWeightsPort,
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: UpdateSourceIndicatorsAndWeightsCommand): Promise<void> {
    const { customForecastIndicatorId, sourceIndicatorsAndWeights } = command;
    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    customForecastIndicator.updateSourceIndicatorsAndWeights(sourceIndicatorsAndWeights);

    await this.updateSourceIndicatorsAndWeightsPort.updateSourceIndicatorsAndWeights(customForecastIndicator);
  }
}
