import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { AudioEntity } from './entities/audio.entity';
import { VideoEntity } from './entities/video.entity';
import { ImageService } from './services/image.service';
import { AudioService } from './services/audio.service';
import { ImageController } from './controllers/image.controller';
import { AudioController } from './controllers/audio.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '../user/user.module';
import { VideoService } from './services/video.service';
import { VideoController } from './controllers/video.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity, AudioEntity, VideoEntity]),
    MulterModule.register({
      dest: './public/files',
    }),
    UserModule,
  ],
  providers: [ImageService, AudioService, VideoService],
  controllers: [ImageController, AudioController, VideoController],
})
export class FileModule {}
