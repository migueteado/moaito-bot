import {
  Body,
  Controller,
  Delete,
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
import { UserService } from '../../user/services/user.service';
import {
  CreateTwitchRewardDTO,
  UpdateTwitchRewardDTO,
} from '../dtos/twitch-reward.dto';
import { TwitchRewardService } from '../services/twitch-reward.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/twitch-reward')
export class TwitchRewardController {
  constructor(
    private twitchRewardService: TwitchRewardService,
    private userService: UserService,
  ) {}

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Post()
  async createReward(
    @Req() request: Request,
    @Body() payload: CreateTwitchRewardDTO,
  ) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);

    return this.twitchRewardService.createReward(user, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Put(':id')
  async updateReward(
    @Param('id') rewardId: string,
    @Req() request: Request,
    @Body() payload: UpdateTwitchRewardDTO,
  ) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);

    return this.twitchRewardService.updateReward(user, rewardId, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Delete(':id')
  async deleteReward(@Param('id') rewardId: string, @Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);

    return this.twitchRewardService.deleteReward(user, rewardId);
  }
}
