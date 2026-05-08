import type { NotificationRequestedEvent } from '../../domain/events/notification-requested.event';

export const TELEGRAM_NOTIFIER = Symbol('TELEGRAM_NOTIFIER');

export interface TelegramNotifier {
  send(event: NotificationRequestedEvent): Promise<void>;
}
