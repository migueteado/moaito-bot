import {
  HttpService,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import config from '../../config';
import { UserTypes } from '../../common/constants/user-types';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
import { TwitchToken } from '../../common/objects/twitchToken';
import { User } from '../../common/objects/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async find(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`Unable to find User for id: ${id}`);
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.find();
    if (!(users.length > 0)) {
      throw new NotFoundException(`No Users found`);
    }
    return users;
  }

  async findByLogin(login: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ login });
    if (!user) {
      throw new NotFoundException(`Unable to find User for login: ${login}`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException(`Unable to find User for email: ${email}`);
    }
    return user;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.id = data.id;
    newUser.email = data.email;
    newUser.login = data.login;
    newUser.userType = UserTypes[data.userType];
    const user: UserEntity = await this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  async update(id: string, data: UpdateUserDTO): Promise<UserEntity> {
    const oldUser: UserEntity = await this.find(id);
    const updates = new UserEntity();
    updates.email = data.email || oldUser.email;
    updates.login = data.login || oldUser.login;
    updates.userType = UserTypes[data.userType] || oldUser.userType;
    const user: UserEntity = await this.userRepository.merge(oldUser, updates);
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<any> {
    const result = await this.userRepository.delete(id);
    return result;
  }

  async updateOrCreate(twitchUser: User): Promise<UserEntity> {
    try {
      let user: UserEntity = await this.findByEmail(twitchUser.email);
      const updates = {
        login: twitchUser.login,
        email: twitchUser.email,
      };

      user = await this.update(user.id, updates);
      return user;
    } catch (error) {
      const newUser = {
        id: twitchUser.id,
        login: twitchUser.login,
        email: twitchUser.email,
        userType: UserTypes.BASIC,
      };

      let user = await this.create(newUser);
      return user;
    }
  }
}
