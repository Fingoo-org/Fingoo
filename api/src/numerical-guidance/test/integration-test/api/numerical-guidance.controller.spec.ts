import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../../infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorsQueryHandler } from '../../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';

describe('NumericalGuidanceController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [NumericalGuidanceController],
      providers: [
        GetFluctuatingIndicatorsQueryHandler,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useValue: {
            loadCachedFluctuatingIndicator: jest.fn(),
          },
        },
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useValue: {
            loadFluctuatingIndicator: jest.fn(),
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

  // it('/get 변동 지표를 불러온다.', () => {
  //   return request(app.getHttpServer()).get('/numerical-guidance/fluctuatingIndicators').expect(200);
  // });

  it('/get 사용자가 유효하지 않는 값 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/numerical-guidance/fluctuatingIndicators')
      .send({
        dataCount: 2,
        tickers: [{ ticker: 'KR7005930001', market: 2 }],
        type: 'KOREA',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
