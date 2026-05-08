import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Channel, ChannelModel, ConsumeMessage, connect } from 'amqplib';
import { NotificationEvent, TelegramService } from './telegram.service';

@Injectable()
export class RabbitmqConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqConsumer.name);
  private connection?: ChannelModel;
  private channel?: Channel;

  private readonly url =
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
  private readonly queue =
    process.env.RABBITMQ_QUEUE ?? 'telegram.notifications';

  constructor(private readonly telegram: TelegramService) {}

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
      const event = JSON.parse(
        message.content.toString('utf8'),
      ) as NotificationEvent;

      await this.telegram.send(event);
      this.channel.ack(message);
      this.logger.log(`Message sent to Telegram: ${event.eventId}`);
    } catch (error) {
      this.logger.error(
        'Message processing failed',
        error instanceof Error ? error.stack : String(error),
      );
      this.channel.nack(message, false, true);
    }
  }
}
