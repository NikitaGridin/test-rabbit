import { Module } from '@nestjs/common';
import { IDEMPOTENCY_STORE } from './application/ports/idempotency-store.port';
import { TELEGRAM_NOTIFIER } from './application/ports/telegram-notifier.port';
import { ProcessNotificationUseCase } from './application/use-cases/process-notification.use-case';
import { InMemoryIdempotencyStore } from './infrastructure/idempotency/in-memory-idempotency.store';
import { RabbitmqConsumer } from './infrastructure/rabbitmq/rabbitmq.consumer';
import { TelegramBotApiNotifier } from './infrastructure/telegram/telegram-bot-api.notifier';
import { HealthController } from './presentation/http/health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    ProcessNotificationUseCase,
    RabbitmqConsumer,
    InMemoryIdempotencyStore,
    TelegramBotApiNotifier,
    {
      provide: IDEMPOTENCY_STORE,
      useExisting: InMemoryIdempotencyStore,
    },
    {
      provide: TELEGRAM_NOTIFIER,
      useExisting: TelegramBotApiNotifier,
    },
  ],
})
export class AppModule {}
