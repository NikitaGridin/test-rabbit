import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ChannelModel, ConfirmChannel, connect } from 'amqplib';
import type { EventPublisher } from '../../application/ports/event-publisher.port';
import type { NotificationRequestedEvent } from '../../domain/events/notification-requested.event';

@Injectable()
export class RabbitmqPublisher implements EventPublisher, OnModuleDestroy {
  private connection?: ChannelModel;
  private channel?: ConfirmChannel;

  private readonly url =
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
  private readonly queue =
    process.env.RABBITMQ_QUEUE ?? 'telegram.notifications';

  async publish(event: NotificationRequestedEvent): Promise<void> {
    const channel = await this.getChannel();
    const payload = Buffer.from(JSON.stringify(event));

    await new Promise<void>((resolve, reject) => {
      channel.sendToQueue(
        this.queue,
        payload,
        {
          contentType: 'application/json',
          persistent: true,
          messageId: event.eventId,
          type: event.type,
        },
        (error) =>
          error
            ? reject(error instanceof Error ? error : new Error(String(error)))
            : resolve(),
      );
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async getChannel(): Promise<ConfirmChannel> {
    if (this.channel) {
      return this.channel;
    }

    this.connection = await connect(this.url);
    this.channel = await this.connection.createConfirmChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    return this.channel;
  }
}
