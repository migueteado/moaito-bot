import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardEntity } from '../../reward/entities/reward.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAudioDTO, UpdateAudioDTO } from '../dtos/audio.dto';
import { AudioEntity } from '../entities/audio.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioEntity)
    private audioRepository: Repository<AudioEntity>,
    private userService: UserService,
  ) {}

  async findByUser(user: UserEntity): Promise<AudioEntity[]> {
    const sounds: AudioEntity[] = await this.audioRepository.find({ user });
    if (!(sounds.length > 0)) {
      throw new NotFoundException('No Sound found');
    }
    return sounds;
  }

  async findByReward(reward: RewardEntity): Promise<AudioEntity[]> {
    const sounds: AudioEntity[] = await this.audioRepository.find({ reward });
    if (!(sounds.length > 0)) {
      throw new NotFoundException('No sounds found');
    }
    return sounds;
  }

  async findOne(id: string): Promise<AudioEntity> {
    const sound: AudioEntity = await this.audioRepository.findOne(id);
    if (!sound) {
      throw new NotFoundException(`Unable to find sound with id ${id}`);
    }
    return sound;
  }

  async create(data: CreateAudioDTO): Promise<AudioEntity> {
    const user: UserEntity = await this.userService.find(data.userId);
    const newSound: AudioEntity = new AudioEntity();
    newSound.name = data.name;
    newSound.path = data.path;
    newSound.user = user;
    const sound = await this.audioRepository.create(newSound);
    return this.audioRepository.save(sound);
  }

  async createMany(data: CreateAudioDTO[]): Promise<AudioEntity[]> {
    const soundsArray: AudioEntity[] = await Promise.all(
      data.map(async (d) => {
        const user: UserEntity = await this.userService.find(d.userId);
        const newSound: AudioEntity = new AudioEntity();
        newSound.name = d.name;
        newSound.path = d.path;
        newSound.user = user;
        return this.audioRepository.create(newSound);
      }),
    );
    return this.audioRepository.save(soundsArray);
  }

  async update(id: string, data: UpdateAudioDTO): Promise<AudioEntity> {
    const oldSound = await this.findOne(id);
    const updates = new AudioEntity();
    updates.name = data.name || oldSound.name;
    updates.path = data.path || oldSound.path;
    const sound = await this.audioRepository.merge(oldSound, updates);
    return this.audioRepository.save(sound);
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.audioRepository.delete(id);
    return result;
  }
}
