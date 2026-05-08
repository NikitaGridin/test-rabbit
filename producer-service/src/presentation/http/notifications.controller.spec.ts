import { PublishNotificationUseCase } from '../../application/use-cases/publish-notification.use-case';
import { NotificationsController } from './notifications.controller';

describe('NotificationsController', () => {
  it('returns event id from use case', async () => {
    const execute = jest.fn().mockResolvedValue({ eventId: 'event-id' });
    const controller = new NotificationsController({
      execute,
    } as unknown as PublishNotificationUseCase);

    await expect(controller.send({ message: 'Hello' })).resolves.toEqual({
      eventId: 'event-id',
    });
    expect(execute).toHaveBeenCalledWith({ message: 'Hello' });
  });
});
