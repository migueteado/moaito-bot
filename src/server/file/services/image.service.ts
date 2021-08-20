import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardEntity } from '../../reward/entities/reward.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateImageDTO, UpdateImageDTO } from '../dtos/image.dto';
import { ImageEntity } from '../entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    private userService: UserService,
  ) {}

  async findByUser(user: UserEntity): Promise<ImageEntity[]> {
    const images: ImageEntity[] = await this.imageRepository.find({ user });
    if (!(images.length > 0)) {
      throw new NotFoundException('No Images found');
    }
    return images;
  }

  async findByReward(reward: RewardEntity): Promise<ImageEntity[]> {
    const images: ImageEntity[] = await this.imageRepository.find({ reward });
    if (!(images.length > 0)) {
      throw new NotFoundException('No Images found');
    }
    return images;
  }

  async findOne(id: string): Promise<ImageEntity> {
    const image: ImageEntity = await this.imageRepository.findOne(id);
    if (!image) {
      throw new NotFoundException(`Unable to find image with id: ${id}`);
    }
    return image;
  }

  async create(data: CreateImageDTO): Promise<ImageEntity> {
    const user: UserEntity = await this.userService.find(data.userId);
    const newImage: ImageEntity = new ImageEntity();
    newImage.name = data.name;
    newImage.path = data.path;
    newImage.user = user;
    const image = await this.imageRepository.create(newImage);
    return this.imageRepository.save(image);
  }

  async createMany(data: CreateImageDTO[]): Promise<ImageEntity[]> {
    const imagesArray: ImageEntity[] = await Promise.all(
      data.map(async (d) => {
        const user: UserEntity = await this.userService.find(d.userId);
        const newImage: ImageEntity = new ImageEntity();
        newImage.name = d.name;
        newImage.path = d.path;
        newImage.user = user;
        return this.imageRepository.create(newImage);
      }),
    );
    return this.imageRepository.save(imagesArray);
  }

  async update(id: string, data: UpdateImageDTO): Promise<ImageEntity> {
    const oldImage = await this.findOne(id);
    const updates = new ImageEntity();
    updates.name = data.name || oldImage.name;
    updates.path = data.path || oldImage.path;
    const image = await this.imageRepository.merge(oldImage, updates);
    return this.imageRepository.save(image);
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.imageRepository.delete(id);
    return result;
  }
}
