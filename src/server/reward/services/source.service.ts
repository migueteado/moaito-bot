import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { ObsSourceEntity } from '../entities/obs-source.entity';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(ObsSourceEntity)
    private sourceRepository: Repository<ObsSourceEntity>,
  ) {}

  async find(id: string): Promise<ObsSourceEntity> {
    const source: ObsSourceEntity = await this.sourceRepository.findOne(id);
    return source;
  }

  async findByUser(user: UserEntity): Promise<ObsSourceEntity> {
    const source: ObsSourceEntity = await this.sourceRepository.findOne({
      user,
    });
    if (!source) {
      await this.create(user);
      return this.findByUser(user);
    }
    return source;
  }

  async create(user: UserEntity) {
    const source = new ObsSourceEntity();
    source.user = user;
    this.sourceRepository.create(source);
    return this.sourceRepository.save(source);
  }
}
