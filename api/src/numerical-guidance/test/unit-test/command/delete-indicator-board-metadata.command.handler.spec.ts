import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DeleteIndicatorBoardMetadataCommandHandler } from '../../../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { DeleteIndicatorBoardMetadataPort } from '../../../application/port/persistence/indicator-board-metadata/delete-indicator-board-metadata.port';
import { DeleteIndicatorBoardMetadataCommand } from '../../../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('InsertIndicatorTickerCommandHandler', () => {
  let deleteIndicatorBoardMetadataCommandHandler: DeleteIndicatorBoardMetadataCommandHandler;
  let deleteIndicatorBoardMetadataPort: DeleteIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        DeleteIndicatorBoardMetadataCommandHandler,
        {
          provide: 'DeleteIndicatorBoardMetadataPort',
          useValue: {
            deleteIndicatorBoardMetadata: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteIndicatorBoardMetadataCommandHandler = module.get(DeleteIndicatorBoardMetadataCommandHandler);
    deleteIndicatorBoardMetadataPort = module.get('DeleteIndicatorBoardMetadataPort');
  }, 10000);

  it('지표보드 메타데이터를 삭제한다.', async () => {
    //given
    const deleteIndicatorBoardMetadataId = 'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0';
    const command: DeleteIndicatorBoardMetadataCommand = new DeleteIndicatorBoardMetadataCommand(
      deleteIndicatorBoardMetadataId,
    );

    //when
    await deleteIndicatorBoardMetadataCommandHandler.execute(command);

    //then
    expect(deleteIndicatorBoardMetadataPort.deleteIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
  });
});
