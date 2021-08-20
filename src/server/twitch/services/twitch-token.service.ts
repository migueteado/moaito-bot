import {
  forwardRef,
  HttpService,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTwitchTokenDTO,
  UpdateTwitchTokenDTO,
} from '../dtos/twitch-token.dto';
import * as FormData from 'form-data';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/services/user.service';
import { TwitchToken } from '../../common/objects/twitchToken';
import config from '../../config';
import { ConfigType } from '@nestjs/config';
import { User } from '../../common/objects/user';
import { TwitchTokenEntity } from '../entities/twitch-token.entity';
import { TwitchUserService } from './twitch-user.service';

@Injectable()
export class TwitchTokenService {
  constructor(
    @InjectRepository(TwitchTokenEntity)
    private twitchTokenRepository: Repository<TwitchTokenEntity>,
    private httpService: HttpService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private userService: UserService,
    @Inject(forwardRef(() => TwitchUserService))
    private twitchUserService: TwitchUserService,
  ) {}

  async find(user: UserEntity): Promise<TwitchTokenEntity> {
    const twitchToken: TwitchTokenEntity =
      await this.twitchTokenRepository.findOne({ user });
    return twitchToken;
  }

  async create(data: CreateTwitchTokenDTO): Promise<TwitchTokenEntity> {
    const user: UserEntity = await this.userService.find(data.userId);
    const newTwitchToken = new TwitchTokenEntity();
    newTwitchToken.user = user;
    newTwitchToken.accessToken = data.accessToken;
    newTwitchToken.refreshToken = data.refreshToken;
    const twitchToken = await this.twitchTokenRepository.create(newTwitchToken);
    return this.twitchTokenRepository.save(twitchToken);
  }

  async update(
    userId: string,
    data: UpdateTwitchTokenDTO,
  ): Promise<TwitchTokenEntity> {
    const user: UserEntity = await this.userService.find(userId);
    const oldTwitchToken: TwitchTokenEntity =
      await this.twitchTokenRepository.findOne({ user });
    const token: TwitchTokenEntity = await this.twitchTokenRepository.merge(
      oldTwitchToken,
      data,
    );
    return this.twitchTokenRepository.save(token);
  }

  async delete(userId: string): Promise<any> {
    const user: UserEntity = await this.userService.find(userId);
    const result: any = await this.twitchTokenRepository.delete({ user });
    return result;
  }

  /**
   * Gets Twitch access token, gets user from twitch and saves both in database
   * @param code string
   * @returns UserEntity
   */
  async getTwitchToken(code: string): Promise<UserEntity> {
    let formData = new FormData();
    formData.append('client_id', this.configService.twitch.clientId);
    formData.append('client_secret', this.configService.twitch.clientSecret);
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', this.configService.twitch.redirectUri);

    const response = await this.httpService
      .post(this.configService.twitch.tokenUri, formData, {
        headers: formData.getHeaders(),
      })
      .toPromise()
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    if (!data || status !== 200) {
      throw new UnauthorizedException(`Error getting twitch auth token`);
    }

    const twitchToken: TwitchToken = data as TwitchToken;
    const twitchUser: User = await this.twitchUserService.getUserFromTwitch(
      twitchToken,
    );

    const user: UserEntity = await this.userService.updateOrCreate(twitchUser);

    await this.delete(user.id);
    const token: CreateTwitchTokenDTO = {
      userId: user.id,
      accessToken: twitchToken.access_token,
      refreshToken: twitchToken.refresh_token,
    };
    await this.create(token);

    return user;
  }

  async refreshTwitchTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<TwitchToken> {
    try {
      let formData = new FormData();
      formData.append('client_id', this.configService.twitch.clientId);
      formData.append('client_secret', this.configService.twitch.clientSecret);
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', refreshToken);

      const response = await this.httpService
        .post(this.configService.twitch.tokenUri, formData, {
          headers: formData.getHeaders(),
        })
        .toPromise()
        .then((res) => res)
        .catch((err) => err.response);

      const { data, status } = response;

      if (!data || status !== 200) {
        throw new UnauthorizedException();
      }

      const refreshedToken: TwitchToken = data as TwitchToken;

      return refreshedToken;
    } catch (error) {
      throw new UnauthorizedException(`Unable to refresh Twitch Token`);
    }
  }

  async refreshTwitchTokenFromUser(
    user: UserEntity,
  ): Promise<TwitchTokenEntity> {
    try {
      const twitchToken: TwitchTokenEntity = await this.find(user);

      let formData = new FormData();
      formData.append('client_id', this.configService.twitch.clientId);
      formData.append('client_secret', this.configService.twitch.clientSecret);
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', twitchToken.refreshToken);

      const response = await this.httpService
        .post(this.configService.twitch.tokenUri, formData, {
          headers: formData.getHeaders(),
        })
        .toPromise()
        .then((res) => res)
        .catch((err) => err.response);

      const { data, status } = response;

      if (!data || status !== 200) {
        throw new UnauthorizedException();
      }

      const refreshedToken: TwitchToken = data as TwitchToken;

      const token: UpdateTwitchTokenDTO = {
        accessToken: refreshedToken.access_token,
        refreshToken: refreshedToken.refresh_token,
      };

      return this.update(user.id, token);
    } catch (error) {
      throw new UnauthorizedException(`Unable to refresh Twitch Token`);
    }
  }
}
