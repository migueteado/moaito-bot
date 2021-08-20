import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTimerDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsNumber()
  @IsNotEmpty()
  readonly interval: number;

  @IsNumber()
  @IsNotEmpty()
  readonly chatMessages: number;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;
}

export class UpdateTimerDTO extends PartialType(CreateTimerDTO) {}
