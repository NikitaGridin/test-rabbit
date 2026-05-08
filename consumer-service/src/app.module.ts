import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitmqConsumer } from './rabbitmq.consumer';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [AppController],
  providers: [RabbitmqConsumer, TelegramService],
})
export class AppModule {}
