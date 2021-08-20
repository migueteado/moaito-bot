import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTwitchTokenDTO {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;

  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}

export class UpdateTwitchTokenDTO extends PartialType(CreateTwitchTokenDTO) {}