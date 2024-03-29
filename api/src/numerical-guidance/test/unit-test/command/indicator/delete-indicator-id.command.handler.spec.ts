import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../../../application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { DeleteIndicatorIdCommandHandler } from '../../../../application/command/indicator/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorIdPort } from '../../../../application/port/persistence/indicator-board-metadata/delete-indicator-id.port';
import { DeleteIndicatorIdCommand } from '../../../../application/command/indicator/delete-indicator-id/delete-indicator-id.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('DeleteIndicatorIdCommandHandler', () => {
  let deleteIndicatorIdCommandHandler: DeleteIndicatorIdCommandHandler;
  let deleteIndicatorIdPort: DeleteIndicatorIdPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        DeleteIndicatorIdCommandHandler,
        {
          provide: 'DeleteIndicatorIdPort',
          useValue: {
            deleteIndicatorId: jest.fn(),
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
                ['160e5499-4925-4e38-bb00-8ea6d8056484'],
                ['120e5434-4925-4e38-bb00-8ea6d8056481'],
                currentDate,
                currentDate,
              );
            }),
          },
        },
      ],
    }).compile();

    deleteIndicatorIdCommandHandler = module.get(DeleteIndicatorIdCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    deleteIndicatorIdPort = module.get('DeleteIndicatorIdPort');
  }, 10000);

  it('지표보드 메타데이터에서 지표 id를 삭제한다.', async () => {
    //given
    const command: DeleteIndicatorIdCommand = new DeleteIndicatorIdCommand(
      'id',
      '160e5499-4925-4e38-bb00-8ea6d8056484',
    );

    //when
    await deleteIndicatorIdCommandHandler.execute(command);

    //then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
    expect(deleteIndicatorIdPort.deleteIndicatorId).toHaveBeenCalledTimes(1);
  });
});
