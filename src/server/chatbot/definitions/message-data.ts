import { UserState } from './user-state';

export class MessageData {
  channelName: string;
  userState: UserState;
  message: string;
  self: boolean;

  constructor(channel: string, userstate: any, message: string, self: boolean) {
    this.channelName = channel.substr(1);
    this.userState = new UserState(userstate);
    this.message = message;
    this.self = self;
  }
}
