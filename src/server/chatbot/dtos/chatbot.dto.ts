import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatbotDTO {
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}

export class UpdateChatbotDTO extends PartialType(CreateChatbotDTO) {}
