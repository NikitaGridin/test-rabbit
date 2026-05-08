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
