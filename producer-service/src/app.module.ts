import { Module } from '@nestjs/common';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { PublishNotificationUseCase } from './application/use-cases/publish-notification.use-case';
import { RabbitmqPublisher } from './infrastructure/rabbitmq/rabbitmq.publisher';
import { NotificationsController } from './presentation/http/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [
    PublishNotificationUseCase,
    RabbitmqPublisher,
    {
      provide: EVENT_PUBLISHER,
      useExisting: RabbitmqPublisher,
    },
  ],
})
export class AppModule {}
