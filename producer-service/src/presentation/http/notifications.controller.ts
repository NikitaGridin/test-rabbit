import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PublishNotificationUseCase } from '../../application/use-cases/publish-notification.use-case';
import { SendNotificationDto } from './dto/send-notification.dto';

class SendNotificationResponse {
  @ApiProperty({ format: 'uuid' })
  eventId!: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly useCase: PublishNotificationUseCase) {}

  @Post()
  @ApiCreatedResponse({ type: SendNotificationResponse })
  async send(
    @Body() dto: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const event = await this.useCase.execute(dto);

    return { eventId: event.eventId };
  }
}
