import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSourceIndicatorsInformationPort } from '../../../port/persistence/custom-forecast-indicator/update-source-indicators-information.port';
import { UpdateSourceIndicatorsInformationCommand } from './update-source-indicators-informations.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { Transactional } from 'typeorm-transactional';
import { LoadCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { LoadIndicatorPort } from 'src/numerical-guidance/application/port/persistence/indicator/load-indicator.port';
import { SourceIndicatorDtoType } from 'src/utils/type/type-definition';
import { SourceIndicatorMapper } from './mapper/source-indicator.mapper';

@Injectable()
@CommandHandler(UpdateSourceIndicatorsInformationCommand)
export class UpdateSourceIndicatorsInformationCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateSourceIndicatorsInformationPort')
    private readonly updateSourceIndicatorsInformationPort: UpdateSourceIndicatorsInformationPort,
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: UpdateSourceIndicatorsInformationCommand): Promise<void> {
    const { customForecastIndicatorId, sourceIndicatorsRequestInformation } = command;

    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    const sourceIndicatorsInformation: SourceIndicatorDtoType[] = [];

    for (const sourceIndicatorInformation of sourceIndicatorsRequestInformation) {
      const sourceIndicatorId = sourceIndicatorInformation.sourceIndicatorId;
      const sourceIndicatorType = sourceIndicatorInformation.indicatorType;
      const sourceIndicator = await this.loadIndicatorPort.loadIndicator(sourceIndicatorId, sourceIndicatorType);

      const sourceIndicatorDtoType: SourceIndicatorDtoType = SourceIndicatorMapper.createSourceIndicatorInformation(
        sourceIndicator,
        sourceIndicatorInformation.weight,
      );

      sourceIndicatorsInformation.push(sourceIndicatorDtoType);
    }
    console.log(sourceIndicatorsInformation);
    customForecastIndicator.updateSourceIndicatorsInformation(sourceIndicatorsInformation);
    await this.updateSourceIndicatorsInformationPort.updateSourceIndicatorsInformation(customForecastIndicator);
  }
}
