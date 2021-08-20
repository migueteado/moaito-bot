import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import { UserService } from '../../user/services/user.service';
import { RewardService } from '../services/reward.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/reward')
export class RewardController {
  constructor(
    private rewardService: RewardService,
    private userService: UserService,
  ) {}

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Get()
  async findByUser(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.rewardService.findByUser(user);
  }
}
