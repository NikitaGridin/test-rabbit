import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { RabbitmqService } from '../src/rabbitmq.service';

describe('ProducerService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: RabbitmqService,
          useValue: {
            publish: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('publishes a notification through Nest application context', async () => {
    const controller = app.get(AppController);

    const response = await controller.send({ message: 'Hello' });

    expect(typeof response.eventId).toBe('string');
  });
});
