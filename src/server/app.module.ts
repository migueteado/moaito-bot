import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import config from './config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RewardModule } from './reward/reward.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ViewModule } from './view/view.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { enviroments } from './enviroments';
import { TwitchModule } from './twitch/twitch.module';
import { WebhooksController } from './webhooks/controllers/webhooks.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_USER: Joi.string().required(),
        TWITCH_ENDPOINT_AUTH: Joi.string().required(),
        TWITCH_CLIENT_ID: Joi.string().required(),
        TWITCH_CLIENT_SECRET: Joi.string().required(),
        TWITCH_REDIRECT_URI: Joi.string().required(),
        CHATBOT_TOKEN: Joi.string().required(),
        CHATBOT_USERNAME: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    RewardModule,
    ChatbotModule,
    FileModule,
    ViewModule,
    TwitchModule,
  ],
  controllers: [WebhooksController],
  providers: [],
})
export class AppModule {}
