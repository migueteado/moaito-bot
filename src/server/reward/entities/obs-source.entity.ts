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
import { UserEntity } from '../../user/entities/user.entity';

@Entity('obs_source')
export class ObsSourceEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @OneToOne(() => UserEntity, (user) => user.obsSource)
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
