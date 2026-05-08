import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';

describe('ConsumerService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('checks health through Nest application context', () => {
    const controller = app.get(AppController);

    expect(controller.health()).toEqual({ status: 'ok' });
  });
});
