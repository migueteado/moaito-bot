import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWordProtectionDTO {
  @IsString()
  @IsNotEmpty()
  readonly responseStatus: string;

  @IsString()
  @IsNotEmpty()
  readonly response: string;

  @IsArray()
  @IsNotEmpty()
  readonly blacklist: string[];

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly userLevel: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}

export class UpdateWordProtectionDTO extends PartialType(
  CreateWordProtectionDTO,
) {}
