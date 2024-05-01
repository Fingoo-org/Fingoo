import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DeleteCustomForecastIndicatorIdCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command.handler';
import { DeleteCustomForecastIndicatorIdPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/delete-custom-forecast-indicator-id.port';
import { LoadIndicatorBoardMetadataPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { DeleteCustomForecastIndicatorIdCommand } from 'src/numerical-guidance/application/command/custom-forecast-indicator/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('DeleteCustomForecastIndicatorIdCommandHandler', () => {
  let deleteCustomForecastIndicatorIdCommandHandler: DeleteCustomForecastIndicatorIdCommandHandler;
  let deleteCustomForecastIndicatorIdPort: DeleteCustomForecastIndicatorIdPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        DeleteCustomForecastIndicatorIdCommandHandler,
        {
          provide: 'DeleteCustomForecastIndicatorIdPort',
          useValue: {
            deleteCustomForecastIndicatorId: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetadata: jest.fn().mockImplementation(() => {
              const currentDate: Date = new Date();
              return new IndicatorBoardMetadata(
                'id',
                'name',
                [
                  {
                    id: '160e5499-4925-4e38-bb00-8ea6d8056484',
                    indicatorType: 'stocks',
                    name: 'Apple Inc',
                    exchange: 'NASDAQ',
                  },
                ],
                ['120e5434-4925-4e38-bb00-8ea6d8056481'],
                {
                  section1: ['160e5499-4925-4e38-bb00-8ea6d8056484', '120e5434-4925-4e38-bb00-8ea6d8056481'],
                },
                currentDate,
                currentDate,
              );
            }),
          },
        },
      ],
    }).compile();
    deleteCustomForecastIndicatorIdCommandHandler = module.get(DeleteCustomForecastIndicatorIdCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    deleteCustomForecastIndicatorIdPort = module.get('DeleteCustomForecastIndicatorIdPort');
  }, 10000);

  it('지표보드 메타데이터에서 예측지표 id를 삭제한다.', async () => {
    // given
    const command: DeleteCustomForecastIndicatorIdCommand = new DeleteCustomForecastIndicatorIdCommand(
      'id',
      '120e5434-4925-4e38-bb00-8ea6d8056481',
    );

    // when
    await deleteCustomForecastIndicatorIdCommandHandler.execute(command);

    // then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
    expect(deleteCustomForecastIndicatorIdPort.deleteCustomForecastIndicatorId).toHaveBeenCalledTimes(1);
  });
});
