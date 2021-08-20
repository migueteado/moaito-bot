import { HttpService, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../config';
import { TwitchTokenService } from '../../twitch/services/twitch-token.service';
import { UserService } from '../../user/services/user.service';
import { Channel } from '../definitions/channel';
import { MessageService } from './message.service';

@Injectable()
export class ChannelService {
  public channels: Channel[];

  constructor(private messageService: MessageService) {
    this.channels = [];
  }

  addChannel(channelName: string) {
    if (!this.channels.some((channel) => channel.name === channelName)) {
      this.channels.push(new Channel(channelName, this.messageService));
    }
  }

  removeChannel(channelName: string) {
    this.channels = this.channels.filter(
      (channel) => channel.name != channelName,
    );
  }

  getChannel(channelName: string): Channel {
    return this.channels.find((channel) => (channel.name = channelName));
  }
}
