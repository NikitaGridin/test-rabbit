import type { IdempotencyStore } from '../ports/idempotency-store.port';
import type { TelegramNotifier } from '../ports/telegram-notifier.port';
import { ProcessNotificationUseCase } from './process-notification.use-case';

describe('ProcessNotificationUseCase', () => {
  const event = {
    eventId: 'event-id',
    type: 'notification.requested' as const,
    createdAt: '2026-05-08T00:00:00.000Z',
    payload: { message: 'Hello', chatId: '1' },
  };

  it('sends telegram message and marks event as processed', async () => {
    const isProcessed = jest.fn().mockResolvedValue(false);
    const markProcessed = jest.fn().mockResolvedValue(undefined);
    const send = jest.fn().mockResolvedValue(undefined);
    const store: IdempotencyStore = { isProcessed, markProcessed };
    const telegram: TelegramNotifier = { send };
    const useCase = new ProcessNotificationUseCase(store, telegram);

    await useCase.execute(event);

    expect(send).toHaveBeenCalledWith(event);
    expect(markProcessed).toHaveBeenCalledWith('event-id');
  });

  it('skips duplicates', async () => {
    const isProcessed = jest.fn().mockResolvedValue(true);
    const markProcessed = jest.fn().mockResolvedValue(undefined);
    const send = jest.fn().mockResolvedValue(undefined);
    const store: IdempotencyStore = { isProcessed, markProcessed };
    const telegram: TelegramNotifier = { send };
    const useCase = new ProcessNotificationUseCase(store, telegram);

    await useCase.execute(event);

    expect(send).not.toHaveBeenCalled();
    expect(markProcessed).not.toHaveBeenCalled();
  });
});
