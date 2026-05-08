import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'Hello from producer' })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsString()
  chatId?: string;
}
