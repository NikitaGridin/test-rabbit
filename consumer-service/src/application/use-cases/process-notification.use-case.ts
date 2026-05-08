import { Inject, Injectable, Logger } from '@nestjs/common';
import type { NotificationRequestedEvent } from '../../domain/events/notification-requested.event';
import {
  IDEMPOTENCY_STORE,
  type IdempotencyStore,
} from '../ports/idempotency-store.port';
import {
  TELEGRAM_NOTIFIER,
  type TelegramNotifier,
} from '../ports/telegram-notifier.port';

@Injectable()
export class ProcessNotificationUseCase {
  private readonly logger = new Logger(ProcessNotificationUseCase.name);

  constructor(
    @Inject(IDEMPOTENCY_STORE)
    private readonly idempotencyStore: IdempotencyStore,
    @Inject(TELEGRAM_NOTIFIER)
    private readonly telegram: TelegramNotifier,
  ) {}

  async execute(event: NotificationRequestedEvent): Promise<void> {
    if (await this.idempotencyStore.isProcessed(event.eventId)) {
      this.logger.warn(`Duplicate event skipped: ${event.eventId}`);
      return;
    }

    await this.telegram.send(event);
    await this.idempotencyStore.markProcessed(event.eventId);
    this.logger.log(`Event processed: ${event.eventId}`);
  }
}
