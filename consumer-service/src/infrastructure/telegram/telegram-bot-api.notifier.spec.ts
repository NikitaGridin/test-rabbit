import { TelegramBotApiNotifier } from './telegram-bot-api.notifier';

describe('TelegramBotApiNotifier', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      TELEGRAM_BOT_TOKEN: 'token',
      TELEGRAM_CHAT_ID: 'chat',
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  it('sends message to Telegram API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await new TelegramBotApiNotifier().send({
      eventId: 'event-id',
      type: 'notification.requested',
      createdAt: '2026-05-08T00:00:00.000Z',
      payload: { message: 'Hello' },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.telegram.org/bottoken/sendMessage',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ chat_id: 'chat', text: 'Hello' }),
      }),
    );
  });
});
