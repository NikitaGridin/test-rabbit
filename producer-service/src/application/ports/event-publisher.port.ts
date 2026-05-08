import type { NotificationRequestedEvent } from '../../domain/events/notification-requested.event';

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');

export interface EventPublisher {
  publish(event: NotificationRequestedEvent): Promise<void>;
}
