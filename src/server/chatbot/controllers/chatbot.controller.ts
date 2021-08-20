import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { ChatbotStatus } from '../../common/constants/chatbot-status';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import { ChatbotService } from '../services/chatbot.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/chatbot')
export class ChatbotController {
  constructor(
    private chatbotService: ChatbotService,
    private userService: UserService,
  ) {}

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Get()
  async find(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.chatbotService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Post('join')
  joinChannel(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    return this.chatbotService.updateOrCreate({
      status: ChatbotStatus.on,
      userId: userId,
    });
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.ADMIN,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
  )
  @Post('part')
  async partChannel(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    return this.chatbotService.updateOrCreate({
      status: ChatbotStatus.off,
      userId: userId,
    });
  }
}
