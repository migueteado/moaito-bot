import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly login: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly userType: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
