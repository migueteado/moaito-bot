import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TimerStatus } from '../../common/constants/timer-status';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('timer')
export class TimerEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'message', type: 'varchar', length: 255 })
  message: string;

  @Column({ name: 'interval', type: 'integer' })
  interval: number;

  @Column({ name: 'chat-messages', type: 'integer' })
  chatMessages: number;

  @ManyToOne(() => UserEntity, (user) => user.timers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TimerStatus,
    default: TimerStatus.on,
  })
  status: TimerStatus;

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
