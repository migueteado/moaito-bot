import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}

export class UpdateImageDTO extends PartialType(CreateImageDTO) {}
