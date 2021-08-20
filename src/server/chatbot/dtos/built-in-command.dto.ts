import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBuiltInCommandDTO {
  @IsString()
  @IsNotEmpty()
  readonly command: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}

export class UpdateBuiltInCommandDTO extends PartialType(
  CreateBuiltInCommandDTO,
) {}
