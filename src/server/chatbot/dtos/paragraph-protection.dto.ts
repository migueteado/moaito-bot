import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParagraphProtectionDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly max: number;

  @IsString()
  @IsNotEmpty()
  readonly responseStatus: string;

  @IsString()
  @IsNotEmpty()
  readonly response: string;

  @IsNumber()
  @IsNotEmpty()
  readonly punishmentTime: number;

  @IsString()
  @IsNotEmpty()
  readonly punishmentType: string;

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

export class UpdateParagraphProtectionDTO extends PartialType(
  CreateParagraphProtectionDTO,
) {}
