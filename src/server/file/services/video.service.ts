import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardEntity } from '../../reward/entities/reward.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateVideoDTO, UpdateVideoDTO } from '../dtos/video.dto';
import { VideoEntity } from '../entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
    private userService: UserService,
  ) {}

  async findByUser(user: UserEntity): Promise<VideoEntity[]> {
    const videos: VideoEntity[] = await this.videoRepository.find({ user });
    if (!(videos.length > 0)) {
      throw new NotFoundException('No Videos found');
    }
    return videos;
  }

  async findByReward(reward: RewardEntity): Promise<VideoEntity[]> {
    const videos: VideoEntity[] = await this.videoRepository.find({ reward });
    if (!(videos.length > 0)) {
      throw new NotFoundException('No Videos found');
    }
    return videos;
  }

  async findOne(id: string): Promise<VideoEntity> {
    const video: VideoEntity = await this.videoRepository.findOne(id);
    if (!video) {
      throw new NotFoundException(`Unable to find video with id ${id}`);
    }
    return video;
  }

  async create(data: CreateVideoDTO): Promise<VideoEntity> {
    const user: UserEntity = await this.userService.find(data.userId);
    const newVideo: VideoEntity = new VideoEntity();
    newVideo.name = data.name;
    newVideo.path = data.path;
    newVideo.user = user;
    const video = await this.videoRepository.create(newVideo);
    return this.videoRepository.save(video);
  }

  async createMany(data: CreateVideoDTO[]): Promise<VideoEntity[]> {
    const videosArray: VideoEntity[] = await Promise.all(
      data.map(async (d) => {
        const user: UserEntity = await this.userService.find(d.userId);
        const newVideo: VideoEntity = new VideoEntity();
        newVideo.name = d.name;
        newVideo.path = d.path;
        newVideo.user = user;
        return this.videoRepository.create(newVideo);
      }),
    );
    return this.videoRepository.save(videosArray);
  }

  async update(id: string, data: UpdateVideoDTO): Promise<VideoEntity> {
    const oldVideo = await this.findOne(id);
    const updates = new VideoEntity();
    updates.name = data.name || oldVideo.name;
    updates.path = data.path || oldVideo.path;
    const video = await this.videoRepository.merge(oldVideo, updates);
    return this.videoRepository.save(video);
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.videoRepository.delete(id);
    return result;
  }
}
