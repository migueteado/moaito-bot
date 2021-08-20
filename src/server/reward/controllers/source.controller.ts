import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import { SourceService } from '../services/source.service';

@Controller('api/source')
export class SourceController {
  constructor(
    private sourceService: SourceService,
    private userService: UserService,
  ) {}

  @Get(':id')
  find(@Param('id') id: string) {
    return this.sourceService.find(id);
  }

  @UseGuards(AuthGuard('jwt'), UserTypeGuard)
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
    return this.sourceService.findByUser(user);
  }
}
