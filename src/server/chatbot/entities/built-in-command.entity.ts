import { Exclude } from 'class-transformer';
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
import { CommandStatus } from '../../common/constants/command-status';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('built_in_command')
export class BuiltInCommandEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'command', type: 'varchar', length: 100 })
  @Unique('uniqueBuiltInCommandNameUserId', ['command', 'user_id'])
  command: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CommandStatus,
    default: CommandStatus.on,
  })
  status: CommandStatus;

  @ManyToOne(() => UserEntity, (user) => user.builtInCommands)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

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
