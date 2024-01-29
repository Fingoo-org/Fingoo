import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../../infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorQueryHandler } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('NumericalGuidanceController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [NumericalGuidanceController],
      providers: [
        GetFluctuatingIndicatorQueryHandler,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useValue: {
            loadCachedFluctuatingIndicator: jest.fn().mockImplementation(() => {
              return FluctuatingIndicatorDto.create(testData);
            }),
          },
        },
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useValue: {
            loadFluctuatingIndicator: jest.fn().mockImplementation(() => {
              return FluctuatingIndicatorDto.create(testData);
            }),
          },
        },
        {
          provide: 'CachingFluctuatingIndicatorPort',
          useValue: {
            cachingFluctuatingIndicator: jest.fn(),
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/get 변동 지표를 불러온다.', () => {
    return request(app.getHttpServer())
      .get('/numerical-guidance/fluctuatingIndicator')
      .query({
        dataCount: 2,
        ticker: '005930',
        market: 'market',
        interval: 'day',
        endDate: '20240125',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/numerical-guidance/fluctuatingIndicator')
      .query({
        dataCount: 2,
        ticker: '005930',
        market: 2,
        endDate: '20240125',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
