import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PunishmentType } from '../../common/constants/punishment-type';
import { ResponseStatus } from '../../common/constants/response-status';
import { ToolStatus } from '../../common/constants/tool-status';
import { UserLevels } from '../../common/constants/user-level';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('paragraph_protection')
export class ParagraphProtectionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'max', type: 'integer' })
  max: number;

  @Column({
    name: 'response-status',
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.on,
  })
  responseStatus: ResponseStatus;

  @Column({ name: 'response', type: 'varchar' })
  response: string;

  @Column({ name: 'punishment_time', type: 'integer' })
  punishmentTime: number;

  @Column({
    name: 'punishment',
    type: 'enum',
    enum: PunishmentType,
    default: PunishmentType.timeout,
  })
  punishment: PunishmentType;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ToolStatus,
    default: ToolStatus.on,
  })
  status: ToolStatus;

  @Column({
    name: 'user_level',
    type: 'enum',
    enum: UserLevels,
    default: UserLevels.OWNER,
  })
  userLevel: UserLevels;

  @OneToOne(() => UserEntity, (user) => user.paragraphProtection)
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
