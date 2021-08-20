import { HttpModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ChatbotService } from './services/chatbot.service';
import { ChatbotController } from './controllers/chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotEntity } from './entities/chatbot.entity';
import { MessageService } from './services/message.service';
import { ChannelService } from './services/channel.service';
import { InputService } from './services/input.service';
import { CustomCommandEntity } from './entities/custom-command.entity';
import { CustomCommandService } from './services/custom-command.service';
import { LevelService } from './services/level.service';
import { CustomCommandController } from './controllers/custom-command.controller';
import { CooldownService } from './services/cooldown.service';
import { TimerService } from './services/timer.service';
import { TimerController } from './controllers/timer.controller';
import { TimerEntity } from './entities/timer.entity';
import { BuiltInCommandService } from './services/built-in-command.service';
import { AuthModule } from '../auth/auth.module';
import { TwitchModule } from '../twitch/twitch.module';
import { BuiltInCommandEntity } from './entities/built-in-command.entity';
import { WordProtectionService } from './services/word-protection.service';
import { LinkProtectionService } from './services/link-protection.service';
import { CapsProtectionService } from './services/caps-protection.service';
import { ParagraphProtectionService } from './services/paragraph-protection.service';
import { SymbolProtectionService } from './services/symbol-protection.service';
import { BuiltInCommandController } from './controllers/built-in-command.controller';
import { CapsProtectionEntity } from './entities/caps-protection.entity';
import { LinkProtectionEntity } from './entities/link-protection.entity';
import { WordProtectionEntity } from './entities/word-protection.entity';
import { SymbolProtectionEntity } from './entities/symbol-protection.entity';
import { ParagraphProtectionEntity } from './entities/paragraph-protection.entity';
import { ModToolsController } from './controllers/mod-tools.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatbotEntity,
      CustomCommandEntity,
      TimerEntity,
      BuiltInCommandEntity,
      CapsProtectionEntity,
      LinkProtectionEntity,
      WordProtectionEntity,
      SymbolProtectionEntity,
      ParagraphProtectionEntity,
    ]),
    UserModule,
    AuthModule,
    HttpModule,
    TwitchModule,
  ],
  providers: [
    ChatbotService,
    MessageService,
    ChannelService,
    InputService,
    CustomCommandService,
    LevelService,
    CooldownService,
    TimerService,
    BuiltInCommandService,
    WordProtectionService,
    LinkProtectionService,
    CapsProtectionService,
    ParagraphProtectionService,
    SymbolProtectionService,
  ],
  controllers: [
    ChatbotController,
    CustomCommandController,
    TimerController,
    BuiltInCommandController,
    ModToolsController,
  ],
})
export class ChatbotModule {}
