import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTwitchRewardDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  readonly cost: number;

  @IsBoolean()
  @IsOptional()
  readonly is_enabled: boolean;

  @IsString()
  @IsOptional()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly background_color: string;

  @IsBoolean()
  @IsOptional()
  readonly is_user_input_required: boolean;

  @IsBoolean()
  @IsOptional()
  readonly is_max_per_stream_enabled: boolean;

  @IsNumber()
  @IsOptional()
  readonly max_per_stream: number;

  @IsBoolean()
  @IsOptional()
  readonly is_max_per_user_per_stream_enabled: boolean;

  @IsNumber()
  @IsOptional()
  readonly max_per_user_per_stream: number;

  @IsBoolean()
  @IsOptional()
  readonly is_global_cooldown_enabled: boolean;

  @IsNumber()
  @IsOptional()
  readonly global_cooldown_seconds: number;

  @IsBoolean()
  @IsOptional()
  readonly should_redemptions_skip_request_queue: boolean;
}

export class UpdateTwitchRewardDTO extends PartialType(CreateTwitchRewardDTO) {}
