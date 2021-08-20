import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwitchModule } from '../twitch/twitch.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ConfigModule,
    PassportModule,
    HttpModule,
    TwitchModule,
    TypeOrmModule.forFeature([TokenEntity]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  providers: [TokenService, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
