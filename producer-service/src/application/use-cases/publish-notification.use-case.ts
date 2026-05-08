import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  NOTIFICATION_REQUESTED,
  type NotificationRequestedEvent,
} from '../../domain/events/notification-requested.event';
import {
  EVENT_PUBLISHER,
  type EventPublisher,
} from '../ports/event-publisher.port';

export interface PublishNotificationCommand {
  readonly message: string;
  readonly chatId?: string;
}

@Injectable()
export class PublishNotificationUseCase {
  constructor(
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
    command: PublishNotificationCommand,
  ): Promise<NotificationRequestedEvent> {
    const event: NotificationRequestedEvent = {
      eventId: randomUUID(),
      type: NOTIFICATION_REQUESTED,
      createdAt: new Date().toISOString(),
      payload: {
        message: command.message,
        chatId: command.chatId,
      },
    };

    await this.publisher.publish(event);

    return event;
  }
}
