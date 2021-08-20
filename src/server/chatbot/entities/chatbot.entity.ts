import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatbotStatus } from '../../common/constants/chatbot-status';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('chatbot')
export class ChatbotEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ChatbotStatus,
    default: ChatbotStatus.off,
  })
  status: ChatbotStatus;

  @OneToOne(() => UserEntity, (user) => user.chatbot)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

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
