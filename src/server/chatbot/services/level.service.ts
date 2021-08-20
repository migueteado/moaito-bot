import { Injectable } from '@nestjs/common';
import { UserLevels } from '../../common/constants/user-level';
import { MessageData } from '../definitions/message-data';
import { CustomCommandEntity } from '../entities/custom-command.entity';

@Injectable()
export class LevelService {
  private getUserLevel(messageData: MessageData) {
    if (messageData.userState.username === messageData.channelName) {
      return UserLevels.OWNER;
    }

    if (messageData.userState.mod) {
      return UserLevels.MODERATOR;
    }

    if (messageData.userState.subscriber) {
      return UserLevels.SUBSCRIBER;
    }

    return UserLevels.ALL;
  }

  hasPermission(command: CustomCommandEntity, messageData: MessageData) {
    if (command.userLevel === UserLevels.ALL) {
      return true;
    } else if (command.userLevel === UserLevels.SUBSCRIBER) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR ||
        this.getUserLevel(messageData) === UserLevels.SUBSCRIBER
      );
    } else if (command.userLevel === UserLevels.MODERATOR) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR
      );
    } else if (command.userLevel === UserLevels.OWNER) {
      return this.getUserLevel(messageData) === UserLevels.OWNER;
    }
    return false;
  }

  hasBuiltInPermission(userLevel: UserLevels, messageData: MessageData) {
    if (userLevel === UserLevels.ALL) {
      return true;
    } else if (userLevel === UserLevels.SUBSCRIBER) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR ||
        this.getUserLevel(messageData) === UserLevels.SUBSCRIBER
      );
    } else if (userLevel === UserLevels.MODERATOR) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR
      );
    } else if (userLevel === UserLevels.OWNER) {
      return this.getUserLevel(messageData) === UserLevels.OWNER;
    }
    return false;
  }

  hasToolPermission(userLevel: UserLevels, messageData: MessageData) {
    if (userLevel === UserLevels.ALL) {
      return true;
    } else if (userLevel === UserLevels.SUBSCRIBER) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR ||
        this.getUserLevel(messageData) === UserLevels.SUBSCRIBER
      );
    } else if (userLevel === UserLevels.MODERATOR) {
      return (
        this.getUserLevel(messageData) === UserLevels.OWNER ||
        this.getUserLevel(messageData) === UserLevels.MODERATOR
      );
    } else if (userLevel === UserLevels.OWNER) {
      return this.getUserLevel(messageData) === UserLevels.OWNER;
    }
    return false;
  }
}
