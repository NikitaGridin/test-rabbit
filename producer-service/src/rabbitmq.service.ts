import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ChannelModel, ConfirmChannel, connect } from 'amqplib';

export interface NotificationEvent {
  eventId: string;
  message: string;
  chatId?: string;
  createdAt: string;
}

@Injectable()
export class RabbitmqService implements OnModuleDestroy {
  private connection?: ChannelModel;
  private channel?: ConfirmChannel;

  private readonly url =
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
  private readonly queue =
    process.env.RABBITMQ_QUEUE ?? 'telegram.notifications';

  async publish(event: NotificationEvent): Promise<void> {
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
