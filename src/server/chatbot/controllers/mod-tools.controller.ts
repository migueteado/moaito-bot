import {
  Body,
  Controller,
  Get,
  Param,
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
import { UpdateCapsProtectionDTO } from '../dtos/caps-protection.dto';
import { UpdateLinkProtectionDTO } from '../dtos/link-protection.dto';
import { UpdateParagraphProtectionDTO } from '../dtos/paragraph-protection.dto';
import { UpdateSymbolProtectionDTO } from '../dtos/symbol-protection.dto';
import { UpdateWordProtectionDTO } from '../dtos/word-protection.dto';
import { CapsProtectionService } from '../services/caps-protection.service';
import { LinkProtectionService } from '../services/link-protection.service';
import { ParagraphProtectionService } from '../services/paragraph-protection.service';
import { SymbolProtectionService } from '../services/symbol-protection.service';
import { WordProtectionService } from '../services/word-protection.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/mod-tools')
export class ModToolsController {
  constructor(
    private userService: UserService,
    private capsProtectionService: CapsProtectionService,
    private paragraphProtectionService: ParagraphProtectionService,
    private symbolProtectionService: SymbolProtectionService,
    private linkProtectionService: LinkProtectionService,
    private wordProtectionService: WordProtectionService,
  ) {}

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get('caps-protection')
  async findCapsProtection(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.capsProtectionService.findOrCreate(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put('caps-protection/:id')
  async updateCapsProtection(
    @Param('id') id: string,
    @Body() payload: UpdateCapsProtectionDTO,
  ) {
    return this.capsProtectionService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get('paragraph-protection')
  async findParagraphProtection(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.paragraphProtectionService.findOrCreate(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put('paragraph-protection/:id')
  async updateParagraphProtection(
    @Param('id') id: string,
    @Body() payload: UpdateParagraphProtectionDTO,
  ) {
    return this.paragraphProtectionService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get('symbol-protection')
  async findSymbolProtection(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.symbolProtectionService.findOrCreate(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put('symbol-protection/:id')
  async updateSymbolProtection(
    @Param('id') id: string,
    @Body() payload: UpdateSymbolProtectionDTO,
  ) {
    return this.symbolProtectionService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get('link-protection')
  async findLinkProtection(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.linkProtectionService.findOrCreate(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put('link-protection/:id')
  async updateLinkProtection(
    @Param('id') id: string,
    @Body() payload: UpdateLinkProtectionDTO,
  ) {
    return this.linkProtectionService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Get('word-protection')
  async findWordProtection(@Req() request: Request) {
    const jwtPayload = request.user as JwtPayload;
    const userId = jwtPayload.sub;
    const user = await this.userService.find(userId);
    return this.wordProtectionService.findOrCreate(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put('word-protection/:id')
  async updateWordProtection(
    @Param('id') id: string,
    @Body() payload: UpdateWordProtectionDTO,
  ) {
    return this.wordProtectionService.update(id, payload);
  }
}
