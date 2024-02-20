import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from '../../../application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { UpdateIndicatorBoardMetadataNamePort } from '../../../application/port/persistence/update-indicator-board-metadata-name.port';
import { UpdateIndicatorBoardMetadataNameCommand } from '../../../application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../../application/port/persistence/load-indiactor-board-metadata.port';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UpdateIndicatorBoardMetadataNameCommandHandler', () => {
  let updateIndicatorBoardMetadataNameCommandHandler: UpdateIndicatorBoardMetadataNameCommandHandler;
  let updateIndicatorBoardMetadataNamePort: UpdateIndicatorBoardMetadataNamePort;
  let loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        UpdateIndicatorBoardMetadataNameCommandHandler,
        {
          provide: 'UpdateIndicatorBoardMetadataNamePort',
          useValue: {
            updateIndicatorBoardMetadataName: jest.fn(),
          },
        },
        {
          provide: 'LoadIndicatorBoardMetadataPort',
          useValue: {
            loadIndicatorBoardMetaData: jest.fn().mockImplementation(() => {
              return new IndicatorBoardMetadata('id', 'name', { 'k-stock': ['ticker'], exchange: [] });
            }),
          },
        },
      ],
    }).compile();

    updateIndicatorBoardMetadataNameCommandHandler = module.get(UpdateIndicatorBoardMetadataNameCommandHandler);
    loadIndicatorBoardMetadataPort = module.get('LoadIndicatorBoardMetadataPort');
    updateIndicatorBoardMetadataNamePort = module.get('UpdateIndicatorBoardMetadataNamePort');
  }, 10000);

  it('지표보드 메타데이터의 이름을 수정한다.', async () => {
    //given
    const command: UpdateIndicatorBoardMetadataNameCommand = new UpdateIndicatorBoardMetadataNameCommand('id', 'name');

    //when
    await updateIndicatorBoardMetadataNameCommandHandler.execute(command);

    //then
    expect(loadIndicatorBoardMetadataPort.loadIndicatorBoardMetaData).toHaveBeenCalledTimes(1);
    expect(updateIndicatorBoardMetadataNamePort.updateIndicatorBoardMetadataName).toHaveBeenCalledTimes(1);
  });
});
