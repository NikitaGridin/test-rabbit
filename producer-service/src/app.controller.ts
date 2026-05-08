import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { randomUUID } from 'node:crypto';
import { RabbitmqService } from './rabbitmq.service';

class SendNotificationDto {
  @ApiProperty({ example: 'Hello from producer' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  chatId?: string;
}

class SendNotificationResponse {
  @ApiProperty({ format: 'uuid' })
  eventId!: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class AppController {
  constructor(private readonly rabbitmq: RabbitmqService) {}

  @Post()
  @ApiCreatedResponse({ type: SendNotificationResponse })
  async send(
    @Body() dto: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const event = {
      eventId: randomUUID(),
      message: dto.message,
      chatId: dto.chatId,
      createdAt: new Date().toISOString(),
    };

    await this.rabbitmq.publish(event);

    return { eventId: event.eventId };
  }
}
