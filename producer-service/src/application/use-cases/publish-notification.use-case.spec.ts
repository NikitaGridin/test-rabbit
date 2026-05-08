import type { EventPublisher } from '../ports/event-publisher.port';
import { PublishNotificationUseCase } from './publish-notification.use-case';

describe('PublishNotificationUseCase', () => {
  it('creates event and publishes it', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const publisher: EventPublisher = { publish };
    const useCase = new PublishNotificationUseCase(publisher);

    const event = await useCase.execute({ message: 'Hello', chatId: '1' });

    expect(event.eventId).toEqual(expect.any(String));
    expect(event.type).toBe('notification.requested');
    expect(event.payload).toEqual({ message: 'Hello', chatId: '1' });
    expect(publish).toHaveBeenCalledWith(event);
  });
});
