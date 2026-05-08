export const NOTIFICATION_REQUESTED = 'notification.requested' as const;

export interface NotificationRequestedEvent {
  readonly eventId: string;
  readonly type: typeof NOTIFICATION_REQUESTED;
  readonly createdAt: string;
  readonly payload: {
    readonly message: string;
    readonly chatId?: string;
  };
}

export function parseNotificationRequestedEvent(
  value: unknown,
): NotificationRequestedEvent {
  if (!isNotificationRequestedEvent(value)) {
    throw new Error('Invalid notification event');
  }

  return value;
}

function isNotificationRequestedEvent(
  value: unknown,
): value is NotificationRequestedEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const event = value as Partial<NotificationRequestedEvent>;
  const payload = event.payload as
    | Partial<NotificationRequestedEvent['payload']>
    | undefined;

  return (
    typeof event.eventId === 'string' &&
    event.type === NOTIFICATION_REQUESTED &&
    typeof event.createdAt === 'string' &&
    !!payload &&
    typeof payload.message === 'string' &&
    (payload.chatId === undefined || typeof payload.chatId === 'string')
  );
}
