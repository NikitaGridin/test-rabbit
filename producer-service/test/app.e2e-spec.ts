import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PublishNotificationUseCase } from '../src/application/use-cases/publish-notification.use-case';
import { NotificationsController } from '../src/presentation/http/notifications.controller';

describe('ProducerService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: PublishNotificationUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({ eventId: 'event-id' }),
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
    const controller = app.get(NotificationsController);

    await expect(controller.send({ message: 'Hello' })).resolves.toEqual({
      eventId: 'event-id',
    });
  });
});
