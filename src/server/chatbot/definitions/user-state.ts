import { MessageType } from './message-type';
export class UserState {
  // message
  messageType: MessageType;
  emotesRaw: string;
  badgesRaw: string;

  // user
  userId: string;
  username: string;
  displayName: string;
  userType: string;
  subscriber: boolean;
  mod: boolean;
  turbo: boolean;
  color: string;

  roomId: string;

  constructor(userstate) {
    this.userId = userstate['user-id'];
    this.username = userstate['username'];
    this.displayName = userstate['display-name'];
    this.userType = userstate['user-type'];
    this.subscriber = userstate['subscriber'];
    this.mod = userstate['mod'];
    this.turbo = userstate['turbo'];
    this.color = userstate['color'];
    this.roomId = userstate['room-id'];
    this.badgesRaw = userstate['badges-raw'];
    this.emotesRaw = userstate['emotes-raw'];
    this.messageType = userstate['message-type'];
  }
}
