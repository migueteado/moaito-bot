import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'token', type: 'varchar', length: 100 })
  token: string;

  @OneToOne(() => UserEntity, (user) => user.token, { nullable: false })
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
