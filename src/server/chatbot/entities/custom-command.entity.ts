import { Exclude } from 'class-transformer';
import { CommandTypes } from '../../common/constants/command-types';
import { UserLevels } from '../../common/constants/user-level';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CommandStatus } from '../../common/constants/command-status';

@Entity('custom_command')
export class CustomCommandEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'command', type: 'varchar', length: 100 })
  @Unique('uniqueCustomCommandNameUserId', ['command', 'user_id'])
  command: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'response', type: 'text' })
  response: string;

  @Column({ name: 'global_cooldown', type: 'integer' })
  globalCooldown: number;

  @Column({ name: 'user_cooldown', type: 'integer' })
  userCooldown: number;

  @Column({ name: 'aliases', type: 'varchar' })
  aliases: string;

  @Column({ name: 'keywords', type: 'varchar' })
  keywords: string;

  @ManyToOne(() => UserEntity, (user) => user.customCommands)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CommandStatus,
    default: CommandStatus.on,
  })
  status: CommandStatus;

  @Column({
    name: 'user_level',
    type: 'enum',
    enum: UserLevels,
    default: UserLevels.ALL,
  })
  userLevel: UserLevels;

  @Column({
    name: 'type',
    type: 'enum',
    enum: CommandTypes,
    default: CommandTypes.SIMPLE,
  })
  commandType: CommandTypes;

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
