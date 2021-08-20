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
import { Request } from 'express';
import { diskStorage } from 'multer';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { UserTypes } from '../../common/constants/user-types';
import { UserType } from '../../common/decorators/user-type.decorator';
import {
  editFileName,
  videoFileFilter,
} from '../../common/filters/file.filter';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import { CreateVideoDTO, UpdateVideoDTO } from '../dtos/video.dto';
import { VideoService } from '../services/video.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/video')
export class VideoController {
  constructor(
    private videoService: VideoService,
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
    return this.videoService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post()
  create(@Body() payload: CreateVideoDTO) {
    return this.videoService.create(payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateVideoDTO) {
    return this.videoService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.videoService.delete(id);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './public/file/video',
        filename: editFileName,
      }),
      fileFilter: videoFileFilter,
      limits: { fileSize: 10000000 },
    }),
  )
  uploadVideo(
    @Req() request: Request,
    @UploadedFile() video: Express.Multer.File,
  ) {
    const user = request.user as JwtPayload;
    const newVideo = {
      name: video.originalname,
      path: video.path,
      userId: user.sub,
    };
    return this.videoService.create(newVideo);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('video', 20, {
      storage: diskStorage({
        destination: './public/file/video',
        filename: editFileName,
      }),
      fileFilter: videoFileFilter,
    }),
  )
  uploadMultipleVideos(
    @Req() request: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const user = request.user as JwtPayload;
    const videosArray = [];
    files.forEach((file) => {
      const newVideo = {
        name: file.originalname,
        path: file.path,
        userId: user.sub,
      };
      videosArray.push(newVideo);
    });
    return this.videoService.createMany(videosArray);
  }
}
