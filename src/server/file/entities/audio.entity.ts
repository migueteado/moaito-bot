import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RewardEntity } from '../../reward/entities/reward.entity';

@Entity('audio')
export class AudioEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'path', type: 'varchar', length: 255 })
  path: string;

  @ManyToOne(() => UserEntity, (user) => user.audios, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => RewardEntity, (reward) => reward.audio)
  reward: RewardEntity;

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
