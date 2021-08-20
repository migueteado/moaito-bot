import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('twitch_token')
export class TwitchTokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'access_token', type: 'varchar', length: 255 })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255 })
  refreshToken: string;

  @OneToOne(() => UserEntity, (user) => user.twitchToken, { nullable: false })
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
