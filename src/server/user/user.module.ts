import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TwitchModule } from '../twitch/twitch.module';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => TwitchModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
