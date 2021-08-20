import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomCommandEntity } from '../../chatbot/entities/custom-command.entity';
import { ObsSourceEntity } from '../../reward/entities/obs-source.entity';
import { RewardEntity } from '../../reward/entities/reward.entity';
import { TimerEntity } from '../../chatbot/entities/timer.entity';
import { TokenEntity } from '../../auth/entities/token.entity';
import { TwitchTokenEntity } from '../../twitch/entities/twitch-token.entity';
import { UserTypes } from '../../common/constants/user-types';
import { ImageEntity } from '../../file/entities/image.entity';
import { AudioEntity } from '../../file/entities/audio.entity';
import { VideoEntity } from '../../file/entities/video.entity';
import { ChatbotEntity } from '../../chatbot/entities/chatbot.entity';
import { BuiltInCommandEntity } from '../../chatbot/entities/built-in-command.entity';
import { CapsProtectionEntity } from '../../chatbot/entities/caps-protection.entity';
import { WordProtectionEntity } from '../../chatbot/entities/word-protection.entity';
import { SymbolProtectionEntity } from '../../chatbot/entities/symbol-protection.entity';
import { ParagraphProtectionEntity } from '../../chatbot/entities/paragraph-protection.entity';
import { LinkProtectionEntity } from '../../chatbot/entities/link-protection.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', unique: true })
  id: string;

  @Column({ name: 'login', type: 'varchar', length: 50 })
  login: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserTypes,
    default: UserTypes.BASIC,
  })
  userType: UserTypes;

  @OneToOne(() => TokenEntity, (token) => token.user)
  token: TokenEntity;

  @OneToOne(() => TwitchTokenEntity, (twitchToken) => twitchToken.user)
  twitchToken: TwitchTokenEntity;

  @OneToOne(() => ChatbotEntity, (chatbot) => chatbot.user)
  chatbot: ChatbotEntity;

  @OneToMany(() => CustomCommandEntity, (customCommands) => customCommands.user)
  customCommands: CustomCommandEntity[];

  @OneToMany(
    () => BuiltInCommandEntity,
    (builtInCommands) => builtInCommands.user,
  )
  builtInCommands: BuiltInCommandEntity[];

  @OneToOne(() => CapsProtectionEntity, (capsProtection) => capsProtection.user)
  capsProtection: CapsProtectionEntity;

  @OneToOne(() => WordProtectionEntity, (wordProtection) => wordProtection.user)
  wordProtection: WordProtectionEntity;

  @OneToOne(() => LinkProtectionEntity, (linkProtection) => linkProtection.user)
  linkProtection: LinkProtectionEntity;

  @OneToOne(
    () => SymbolProtectionEntity,
    (symbolProtection) => symbolProtection.user,
  )
  symbolProtection: SymbolProtectionEntity;

  @OneToOne(
    () => ParagraphProtectionEntity,
    (paragraphProtection) => paragraphProtection.user,
  )
  paragraphProtection: ParagraphProtectionEntity;

  @OneToMany(() => TimerEntity, (timers) => timers.user)
  timers: TimerEntity[];

  @OneToMany(() => ImageEntity, (images) => images.user)
  images: ImageEntity[];

  @OneToMany(() => AudioEntity, (audios) => audios.user)
  audios: AudioEntity[];

  @OneToMany(() => VideoEntity, (videos) => videos.user)
  videos: VideoEntity[];

  @OneToMany(() => RewardEntity, (rewards) => rewards.user)
  rewards: RewardEntity[];

  @OneToOne(() => ObsSourceEntity, (obsSource) => obsSource.user)
  obsSource: ObsSourceEntity;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
