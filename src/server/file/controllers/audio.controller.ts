import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import {
  editFileName,
  audioFileFilter,
} from '../../common/filters/file.filter';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import { CreateAudioDTO, UpdateAudioDTO } from '../dtos/audio.dto';
import { AudioService } from '../services/audio.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/audio')
export class AudioController {
  constructor(
    private audioService: AudioService,
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
    return this.audioService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post()
  create(@Body() payload: CreateAudioDTO) {
    return this.audioService.create(payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateAudioDTO) {
    return this.audioService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.audioService.delete(id);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './public/file/audio',
        filename: editFileName,
      }),
      fileFilter: audioFileFilter,
      limits: { fileSize: 5000000 },
    }),
  )
  uploadAudio(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request.user as JwtPayload;
    const newFile = {
      name: file.originalname,
      path: file.path,
      userId: user.sub,
    };
    return this.audioService.create(newFile);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('audio', 20, {
      storage: diskStorage({
        destination: './public/file/audio',
        filename: editFileName,
      }),
      fileFilter: audioFileFilter,
    }),
  )
  uploadMultipleSounds(
    @Req() request: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const user = request.user as JwtPayload;
    const filesArray = [];
    files.forEach((file) => {
      const newFile = {
        name: file.originalname,
        path: file.path,
        userId: user.sub,
      };
      filesArray.push(newFile);
    });
    return this.audioService.createMany(filesArray);
  }
}
