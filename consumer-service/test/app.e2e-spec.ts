import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HealthController } from '../src/presentation/http/health.controller';

describe('ConsumerService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('checks health through Nest application context', () => {
    const controller = app.get(HealthController);

    expect(controller.health()).toEqual({ status: 'ok' });
  });
});
