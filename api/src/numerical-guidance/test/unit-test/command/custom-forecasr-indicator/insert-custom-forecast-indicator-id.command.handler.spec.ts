import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { InsertCustomForecastIndicatorIdCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { InsertCustomForecastIndicatorIdPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/insert-custom-forecast-indicator-id.port';
import { LoadIndicatorBoardMetadataPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { InsertCustomForecastIndicatorIdCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('InsertCustomForecastIndicatorIdCommandHandler', () => {
  let insertCustomForecastIndicatorIdCommandHandler: InsertCustomForecastIndicatorIdCommandHandler;
  let insertCustomForecastIndicatorIdPort: InsertCustomForecastIndicatorIdPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        InsertCustomForecastIndicatorIdCommandHandler,
        {
          provide: 'InsertCustomForecastIndicatorIdPort',
          useValue: {
            addCustomForecastIndicatorId: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetadata: jest.fn().mockImplementation(() => {
              const currentDate: Date = new Date();
              return new IndicatorBoardMetadata('id', 'name', [], [], currentDate, currentDate);
            }),
          },
        },
      ],
    }).compile();

    insertCustomForecastIndicatorIdCommandHandler = module.get(InsertCustomForecastIndicatorIdCommandHandler);
    insertCustomForecastIndicatorIdPort = module.get('InsertCustomForecastIndicatorIdPort');
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
  }, 10000);

  it('지표보드 메타데이터에 예측지표 id를 추가한다.', async () => {
    // given
    const command: InsertCustomForecastIndicatorIdCommand = new InsertCustomForecastIndicatorIdCommand(
      'id',
      '150e5499-4925-4e38-bb00-8ea6d8su4934',
    );

    // when
    await insertCustomForecastIndicatorIdCommandHandler.execute(command);

    // then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
    expect(insertCustomForecastIndicatorIdPort.addCustomForecastIndicatorId).toHaveBeenCalledTimes(1);
  });
});
