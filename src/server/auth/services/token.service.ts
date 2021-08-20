import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tokenGenerator } from '../../common/utils/token-generator';
import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  async findOne(refreshToken: string): Promise<TokenEntity> {
    const token: TokenEntity = await this.tokenRepository.findOne(
      { token: refreshToken },
      {
        relations: ['user'],
      },
    );

    if (!token) {
      throw new NotFoundException(`Unable to find token: ${refreshToken}`);
    }

    return token;
  }

  async create(user: UserEntity): Promise<TokenEntity> {
    const token = new TokenEntity();
    token.token = tokenGenerator(50);
    token.user = user;

    return await this.tokenRepository.save(token);
  }

  async delete(user: UserEntity): Promise<any> {
    const result = await this.tokenRepository.delete({ user });
    return result;
  }
}
