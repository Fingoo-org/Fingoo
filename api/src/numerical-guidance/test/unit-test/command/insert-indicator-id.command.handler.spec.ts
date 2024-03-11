import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { InsertIndicatorIdPort } from '../../../application/port/persistence/indicator-board-metadata/insert-indicator-id.port';
import { LoadIndicatorBoardMetadataPort } from '../../../application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { InsertIndicatorIdCommandHandler } from '../../../application/command/insert-indicator-id/insert-indicator-id.command.handler';
import { InsertIndicatorIdCommand } from '../../../application/command/insert-indicator-id/insert-indicator-id.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('InsertIndicatorIdCommandHandler', () => {
  let insertIndicatorIdCommandHandler: InsertIndicatorIdCommandHandler;
  let insertIndicatorIdPort: InsertIndicatorIdPort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        InsertIndicatorIdCommandHandler,
        {
          provide: 'InsertIndicatorIdPort',
          useValue: {
            addIndicatorId: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetadata: jest.fn().mockImplementation(() => {
              const currentDate = new Date();
              return new IndicatorBoardMetadata('id', 'name', [], currentDate, currentDate);
            }),
          },
        },
      ],
    }).compile();

    insertIndicatorIdCommandHandler = module.get(InsertIndicatorIdCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    insertIndicatorIdPort = module.get('InsertIndicatorIdPort');
  }, 10000);

  it('지표보드 메타데이터에 지표 id를 추가한다.', async () => {
    //given
    const command: InsertIndicatorIdCommand = new InsertIndicatorIdCommand(
      'id',
      '160e5499-4925-4e38-bb00-8ea6d8056484',
    );

    //when
    await insertIndicatorIdCommandHandler.execute(command);

    //then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
    expect(insertIndicatorIdPort.addIndicatorId).toHaveBeenCalledTimes(1);
  });
});
