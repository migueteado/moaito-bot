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
  imageFileFilter,
} from '../../common/filters/file.filter';
import { UserTypeGuard } from '../../common/guards/user-type.guard';
import { UserService } from '../../user/services/user.service';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { ImageService } from '../services/image.service';

@UseGuards(AuthGuard('jwt'), UserTypeGuard)
@Controller('api/image')
export class ImageController {
  constructor(
    private imageService: ImageService,
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
    return this.imageService.findByUser(user);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post()
  create(@Body() payload: CreateImageDTO) {
    return this.imageService.create(payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateImageDTO) {
    return this.imageService.update(id, payload);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.imageService.delete(id);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/file/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5000000 },
    }),
  )
  uploadImage(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = request.user as JwtPayload;
    const newImage = {
      name: image.originalname,
      path: image.path,
      userId: user.sub,
    };
    return this.imageService.create(newImage);
  }

  @UserType(
    UserTypes.BASIC,
    UserTypes.PRO,
    UserTypes.SUPPORTER,
    UserTypes.ADMIN,
  )
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/file/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadMultipleImages(
    @Req() request: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const user = request.user as JwtPayload;
    const imageArray: CreateImageDTO[] = [];
    files.forEach((file) => {
      const newImage = {
        name: file.originalname,
        path: file.path,
        userId: user.sub,
      };
      imageArray.push(newImage);
    });
    return this.imageService.createMany(imageArray);
  }
}
