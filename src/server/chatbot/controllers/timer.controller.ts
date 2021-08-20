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
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { CreateTimerDTO, UpdateTimerDTO } from '../../chatbot/dtos/timer.dto';
import { TimerService } from '../services/timer.service';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserService } from '../../user/services/user.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/timer')
export class TimerController {
  constructor(
    private timerService: TimerService,
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
    return this.timerService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post()
  create(@Body() payload: CreateTimerDTO) {
    return this.timerService.create(payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTimerDTO) {
    return this.timerService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.timerService.delete(id);
  }
}
