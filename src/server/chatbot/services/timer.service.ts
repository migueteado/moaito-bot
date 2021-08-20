import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { Repository } from 'typeorm';
import { CreateTimerDTO, UpdateTimerDTO } from '../dtos/timer.dto';
import { TimerEntity } from '../entities/timer.entity';
import { TimerStatus } from '../../common/constants/timer-status';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(TimerEntity)
    private timerRepository: Repository<TimerEntity>,
    private userService: UserService,
  ) {}

  async find(id: string): Promise<TimerEntity> {
    const timer: TimerEntity = await this.timerRepository.findOne(id);
    if (!timer) {
      throw new NotFoundException(`Unable to find Timer for id: ${id}`);
    }
    return timer;
  }

  async findAll(): Promise<TimerEntity[]> {
    const timers: TimerEntity[] = await this.timerRepository.find();
    return timers;
  }

  async findByUser(user: UserEntity): Promise<TimerEntity[]> {
    const timers: TimerEntity[] = await this.timerRepository.find({ user });
    return timers;
  }

  async create(data: CreateTimerDTO): Promise<TimerEntity> {
    const user = await this.userService.find(data.userId);
    const newTimer = new TimerEntity();
    newTimer.user = user;
    newTimer.name = data.name;
    newTimer.message = data.message;
    newTimer.interval = data.interval;
    newTimer.chatMessages = data.chatMessages;
    newTimer.status = TimerStatus[data.status];
    const timer = await this.timerRepository.create(newTimer);
    return this.timerRepository.save(timer);
  }

  async update(id: string, data: UpdateTimerDTO): Promise<TimerEntity> {
    const oldTimer = await this.find(id);
    const updates = new TimerEntity();
    updates.message = data.message || oldTimer.message;
    updates.interval = data.interval || oldTimer.interval;
    updates.chatMessages = data.chatMessages || oldTimer.chatMessages;
    updates.status = TimerStatus[data.status] || oldTimer.status;
    if (data.userId) {
      const user = await this.userService.find(data.userId);
      updates.user = user;
    }
    const timer = await this.timerRepository.merge(oldTimer, updates);
    return this.timerRepository.save(timer);
  }

  async delete(id: string): Promise<any> {
    const result = await this.timerRepository.delete(id);
    return result;
  }
}
