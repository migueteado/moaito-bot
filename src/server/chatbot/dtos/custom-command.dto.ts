import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCustomCommandDTO {
  @IsString()
  @IsNotEmpty()
  readonly command: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @IsNotEmpty()
  readonly response: string[];

  @IsNumber()
  @IsNotEmpty()
  readonly globalCooldown: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userCooldown: number;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly commandType: string;

  @IsString()
  @IsNotEmpty()
  readonly userLevel: string;

  @IsArray()
  readonly aliases: string[];

  @IsArray()
  readonly keywords: string[];
}

export class UpdateCustomCommandDTO extends PartialType(
  CreateCustomCommandDTO,
) {}
