import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  controllers: [AppController],
  providers: [RabbitmqService],
})
export class AppModule {}
