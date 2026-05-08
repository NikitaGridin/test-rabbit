import { Injectable } from '@nestjs/common';
import type { TelegramNotifier } from '../../application/ports/telegram-notifier.port';
import type { NotificationRequestedEvent } from '../../domain/events/notification-requested.event';

@Injectable()
export class TelegramBotApiNotifier implements TelegramNotifier {
  private readonly token = process.env.TELEGRAM_BOT_TOKEN ?? '';
  private readonly defaultChatId = process.env.TELEGRAM_CHAT_ID ?? '';

  async send(event: NotificationRequestedEvent): Promise<void> {
    const chatId = event.payload.chatId ?? this.defaultChatId;

    if (!this.token || !chatId) {
      throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required');
    }

    const response = await fetch(
      `https://api.telegram.org/bot${this.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: event.payload.message,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Telegram API failed with status ${response.status}`);
    }
  }
}
