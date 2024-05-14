import { CreateIndicatorBoardMetadataCommandHandler } from '../../../../application/command/indicator-board-metadata/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { CreateIndicatorBoardMetadataPort } from '../../../../application/port/persistence/indicator-board-metadata/create-indicator-board-metadata.port';
import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CreateIndicatorBoardMetadataCommand } from '../../../../application/command/indicator-board-metadata/create-indicator-board-metadata/create-indicator-board-metadata.command';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CreateIndicatorBoardMetadataCommandHandler', () => {
  let createIndicatorBoardMetadataCommandHandler: CreateIndicatorBoardMetadataCommandHandler;
  let createIndicatorBoardMetadataPort: CreateIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        CreateIndicatorBoardMetadataCommandHandler,
        {
          provide: 'CreateIndicatorBoardMetadataPort',
          useValue: {
            createIndicatorBoardMetadata: jest.fn().mockImplementation(() => {
              const testId = '008628f5-4dbd-4c3b-b793-ca0fa22b3cfa';
              return testId;
            }),
          },
        },
      ],
    }).compile();

    createIndicatorBoardMetadataCommandHandler = module.get(CreateIndicatorBoardMetadataCommandHandler);
    createIndicatorBoardMetadataPort = module.get('CreateIndicatorBoardMetadataPort');
  }, 10000);

  it('지표보드 메타데이터를 생성한다.', async () => {
    //given
    const command: CreateIndicatorBoardMetadataCommand = new CreateIndicatorBoardMetadataCommand('메타데이터', '1');

    //when
    const indicatorBoardMetaDataId: string = await createIndicatorBoardMetadataCommandHandler.execute(command);

    //then
    expect(indicatorBoardMetaDataId).toEqual('008628f5-4dbd-4c3b-b793-ca0fa22b3cfa');
    expect(createIndicatorBoardMetadataPort.createIndicatorBoardMetadata).toHaveBeenCalledTimes(1);
  });
});
