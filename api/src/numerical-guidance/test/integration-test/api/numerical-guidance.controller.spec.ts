import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { LiveIndicatorDto } from '../../../application/query/get-live-indicator/live-indicator.dto';
import { liveIndicatorTestData } from '../../data/liveIndicator.test.data';
import { CreateIndicatorBoardMetadataCommandHandler } from '../../../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { InsertIndicatorIdCommandHandler } from '../../../application/command/insert-indicator-id/insert-indicator-id.command.handler';
import { GetCustomForecastIndicatorQueryHandler } from 'src/numerical-guidance/application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { CreateCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CustomForecastIndicatorController } from '../../../api/custom-forecast-indicator/custom-forecast-indicator.controller';
import { HistoryIndicatorController } from '../../../api/history-indicator/history-indicator.controller';
import { IndicatorController } from '../../../api/indicator/indicator.controller';
import { IndicatorBoardMetadataController } from '../../../api/indicator-board-metadata/indicator-board-metadata.controller';
import { LiveIndicatorController } from '../../../api/live-indicator/live-indicator.controller';

const testData = liveIndicatorTestData;

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('NumericalGuidanceControllers', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [CqrsModule],
        controllers: [
          CustomForecastIndicatorController,
          HistoryIndicatorController,
          IndicatorController,
          IndicatorBoardMetadataController,
          LiveIndicatorController,
        ],
        providers: [
          CreateIndicatorBoardMetadataCommandHandler,
          InsertIndicatorIdCommandHandler,
          CreateCustomForecastIndicatorCommandHandler,
          GetCustomForecastIndicatorQueryHandler,
          {
            provide: 'LoadCachedLiveIndicatorPort',
            useValue: {
              loadCachedLiveIndicator: jest.fn().mockImplementation(() => {
                return LiveIndicatorDto.create({ indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484', ...testData });
              }),
            },
          },
          {
            provide: 'CachingLiveIndicatorPort',
            useValue: {
              cachingFluctuatingIndicator: jest.fn(),
            },
          },
          {
            provide: 'CreateIndicatorBoardMetadataPort',
            useValue: {
              createIndicatorBoardMetadata: jest.fn(),
            },
          },
          {
            provide: 'LoadIndicatorBoardMetadataPort',
            useValue: {
              loadIndicatorBoardMetaData: jest.fn(),
            },
          },
          {
            provide: 'InsertIndicatorIdPort',
            useValue: {
              addIndicatorId: jest.fn(),
            },
          },
          {
            provide: 'CreateCustomForecastIndicatorPort',
            useValue: {
              createCustomForecastIndicator: jest.fn(),
            },
          },
          {
            provide: 'LoadCustomForecastIndicatorPort',
            useValue: {
              loadCustomForecastIndicator: jest.fn(),
            },
          },
        ],
      }).compile(),
    ]);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('/post 지표보드 메타데이터를 생성한다.', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata')
      .send({
        indicatorBoardMetadataName: '메타데이터',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터를 생성할 때 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata')
      .send({
        indicatorBoardMetadataName: ' ',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/post 예측지표를 생성한다.', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/custom-forecast-indicator')
      .send({
        customForecastIndicatorName: '예측지표',
        targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 예측지표를 생성할 때 유효하지 않은 데이터를 전송한다. - 예측 지표이름을 빈 값으로 전송', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/custom-forecast-indicator')
      .send({
        customForecastIndicatorName: '  ',
        targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/post 예측지표를 생성할 때 유효하지 않은 데이터를 전송한다. - 유효하지 않은 uuid 전송', () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/custom-forecast-indicator')
      .send({
        customForecastIndicatorName: '예측지표',
        targetIndicatorId: 'invalid-uuid',
        memberId: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
