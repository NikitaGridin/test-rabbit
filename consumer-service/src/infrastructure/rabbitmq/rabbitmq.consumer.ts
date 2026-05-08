import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';
import { ProcessNotificationUseCase } from '../../application/use-cases/process-notification.use-case';
import { parseNotificationRequestedEvent } from '../../domain/events/notification-requested.event';

@Injectable()
export class RabbitmqConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqConsumer.name);
  private connection?: ChannelModel;
  private channel?: Channel;

  private readonly url =
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
  private readonly queue =
    process.env.RABBITMQ_QUEUE ?? 'telegram.notifications';

  constructor(private readonly useCase: ProcessNotificationUseCase) {}

  async onModuleInit(): Promise<void> {
    this.connection = await connect(this.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
    await this.channel.prefetch(1);
    await this.channel.consume(
      this.queue,
      (message) => void this.handleMessage(message),
      { noAck: false },
    );
    this.logger.log(`Listening RabbitMQ queue: ${this.queue}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async handleMessage(message: ConsumeMessage | null): Promise<void> {
    if (!message || !this.channel) {
      return;
    }

    try {
      const event = parseNotificationRequestedEvent(
        JSON.parse(message.content.toString('utf8')),
      );

      await this.useCase.execute(event);
      this.channel.ack(message);
    } catch (error) {
      this.logger.error(
        'Message processing failed',
        error instanceof Error ? error.stack : String(error),
      );
      this.channel.nack(message, false, true);
    }
  }
}
