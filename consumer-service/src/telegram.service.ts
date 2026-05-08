import { Injectable } from '@nestjs/common';

export interface NotificationEvent {
  eventId: string;
  message: string;
  chatId?: string;
  createdAt: string;
}

@Injectable()
export class TelegramService {
  private readonly token = process.env.TELEGRAM_BOT_TOKEN ?? '';

  async send(event: NotificationEvent): Promise<void> {
    const chatId = event.chatId;

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
          text: event.message,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Telegram API failed with status ${response.status}`);
    }
  }
}
