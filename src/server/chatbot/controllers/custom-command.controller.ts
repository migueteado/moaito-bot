import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import {
  CreateCustomCommandDTO,
  UpdateCustomCommandDTO,
} from '../dtos/custom-command.dto';
import { CustomCommandService } from '../services/custom-command.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/custom-command')
export class CustomCommandController {
  constructor(
    private customCommandService: CustomCommandService,
    private userService: UserService,
  ) {}

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get()
  async findByUser(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.customCommandService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post()
  create(@Body() payload: CreateCustomCommandDTO) {
    return this.customCommandService.create(payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateCustomCommandDTO) {
    return this.customCommandService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customCommandService.delete(id);
  }
}
