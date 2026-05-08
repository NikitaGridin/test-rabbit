import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
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

    await new TelegramService().send({
      eventId: '1',
      message: 'Hello',
      createdAt: '2026-05-08T00:00:00.000Z',
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
