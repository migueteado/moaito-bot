import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageEntity } from '../../file/entities/image.entity';
import { AudioEntity } from '../../file/entities/audio.entity';
import { VideoEntity } from '../../file/entities/video.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('reward')
export class RewardEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', unique: true })
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.rewards, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => AudioEntity, (audio) => audio.reward, { nullable: true })
  @JoinColumn({ name: 'audio_id' })
  audio: AudioEntity;

  @ManyToOne(() => ImageEntity, (image) => image.reward, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  @ManyToOne(() => VideoEntity, (video) => video.reward, { nullable: true })
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;

  @Exclude()
  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
