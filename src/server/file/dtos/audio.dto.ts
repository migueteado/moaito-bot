import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAudioDTO {
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

export class UpdateAudioDTO extends PartialType(CreateAudioDTO) {}
