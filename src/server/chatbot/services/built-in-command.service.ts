import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CommandStatus } from '../../common/constants/command-status';
import { UserLevels } from '../../common/constants/user-level';
import { TwitchChannelService } from '../../twitch/services/twitch-channel.service';
import { TwitchGameService } from '../../twitch/services/twitch-game.service';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { BuiltInCommand } from '../definitions/built-in-command';
import { BuiltInCommands } from '../definitions/built-in-commands';
import { ChannelInfo } from '../definitions/channel-info';
import { MessageData } from '../definitions/message-data';
import {
  CreateBuiltInCommandDTO,
  UpdateBuiltInCommandDTO,
} from '../dtos/built-in-command.dto';
import { BuiltInCommandEntity } from '../entities/built-in-command.entity';
import { InputService } from './input.service';
import { LevelService } from './level.service';

@Injectable()
export class BuiltInCommandService {
  constructor(
    @InjectRepository(BuiltInCommandEntity)
    private commandRepository: Repository<BuiltInCommandEntity>,
    private inputService: InputService,
    private levelService: LevelService,
    private twitchChannelService: TwitchChannelService,
    private twitchGameService: TwitchGameService,
    private userService: UserService,
  ) {}

  async find(id: string): Promise<BuiltInCommandEntity> {
    const command: BuiltInCommandEntity = await this.commandRepository.findOne(
      id,
    );
    if (!command) {
      throw new NotFoundException(`BuiltInCommand for id ${id} not found`);
    }
    return command;
  }

  async findByCommandAndUser(
    command: string,
    user: UserEntity,
  ): Promise<BuiltInCommandEntity> {
    const builtInCommand: BuiltInCommandEntity =
      await this.commandRepository.findOne({ command, user });
    return builtInCommand;
  }

  async findByUser(user: UserEntity): Promise<any[]> {
    const commands: BuiltInCommandEntity[] = await this.commandRepository.find({
      user,
    });

    return [
      ...BuiltInCommands.map((c) => {
        const savedCommand = commands.find((sc) => sc.command === c.command);
        const command = {
          command: c.command,
          description: c.description,
          status: savedCommand ? savedCommand.status : c.status,
        };
        return command;
      }),
    ];

    // return BuiltInCommands;
  }

  async create(data: CreateBuiltInCommandDTO): Promise<any> {
    const user: UserEntity = await this.userService.find(data.userId);
    const builtInCommand = BuiltInCommands.find(
      (bic) => bic.command === data.command,
    );
    let newCommand = new BuiltInCommandEntity();
    newCommand.command = data.command;
    newCommand.status = CommandStatus[data.status];
    newCommand.user = user;
    const command = await this.commandRepository.create(newCommand);
    const savedCommand = await this.commandRepository.save(command);
    return {
      command: builtInCommand.command,
      description: builtInCommand.description,
      status: savedCommand.status,
    };
  }

  async update(id: string, data: UpdateBuiltInCommandDTO): Promise<any> {
    const oldCommand: BuiltInCommandEntity = await this.find(id);
    const builtInCommand = BuiltInCommands.find(
      (bic) => bic.command === data.command,
    );
    const updates = new BuiltInCommandEntity();
    updates.command = data.command || oldCommand.command;

    if (data.status) {
      updates.status = CommandStatus[data.status];
    } else {
      updates.status = oldCommand.status;
    }

    const command: BuiltInCommandEntity = await this.commandRepository.merge(
      oldCommand,
      updates,
    );
    const savedCommand = await this.commandRepository.save(command);
    return {
      command: builtInCommand.command,
      description: builtInCommand.description,
      status: savedCommand.status,
    };
  }

  async updateOrCreate(data: CreateBuiltInCommandDTO): Promise<any> {
    try {
      let user: UserEntity = await this.userService.find(data.userId);
      let builtInCommand: BuiltInCommandEntity =
        await this.findByCommandAndUser(data.command, user);

      return this.update(builtInCommand.id, data);
    } catch (error) {
      return this.create(data);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.commandRepository.delete(id);
    return result;
  }

  isBuiltInCommand(messageData: MessageData) {
    let parsedInput = this.inputService.parseInput(messageData.message);
    return BuiltInCommands.map(
      (builtInCommand) => builtInCommand.command,
    ).includes(parsedInput[0]);
  }

  async processBuiltInCommand(
    command: BuiltInCommand,
    messageData: MessageData,
  ) {
    let parsedInput = this.inputService.parseInput(messageData.message);
    switch (command.command) {
      case '!moaitobot':
        return 'MoaitoBot is the new bot in town! Check it out at https://bot.itsmoaito.com';
      case '!settitle':
        if (
          !this.levelService.hasBuiltInPermission(
            UserLevels.MODERATOR,
            messageData,
          )
        )
          return;
        return await this.setChannelTitle(messageData, parsedInput.join(' '));
      case '!setgame':
        if (
          !this.levelService.hasBuiltInPermission(
            UserLevels.MODERATOR,
            messageData,
          )
        )
          return;
        return await this.setChannelGame(messageData, parsedInput[0]);
      case '!setdelay':
        if (
          !this.levelService.hasBuiltInPermission(
            UserLevels.MODERATOR,
            messageData,
          )
        )
          return;
        return await this.setChannelDelay(messageData, parsedInput[0]);
      case '!setlanguage':
        if (
          !this.levelService.hasBuiltInPermission(
            UserLevels.MODERATOR,
            messageData,
          )
        )
          return;
        return await this.setChannelLanguage(messageData, parsedInput[0]);
      case '!title':
        if (
          !this.levelService.hasBuiltInPermission(UserLevels.ALL, messageData)
        )
          return;
        return await this.getChannelTitle(messageData.channelName);
      case '!game':
        if (
          !this.levelService.hasBuiltInPermission(UserLevels.ALL, messageData)
        )
          return;
        return await this.getChannelGame(messageData.channelName);
      case '!delay':
        if (
          !this.levelService.hasBuiltInPermission(UserLevels.ALL, messageData)
        )
          return;
        return await this.getChannelDelay(messageData.channelName);
      case '!language':
        if (
          !this.levelService.hasBuiltInPermission(UserLevels.ALL, messageData)
        )
          return;
        return await this.getChannelLanguage(messageData.channelName);
      default:
        return '';
    }
  }

  async setChannelTitle(messageData: MessageData, title: string) {
    const result = await this.twitchChannelService.updateChannelInformation(
      messageData.channelName,
      title,
      null,
      null,
      null,
    );
    if (result) {
      return `${messageData.userState.username} changed the title to: "${title}"`;
    }
    return `Unable to update Channel Title`;
  }

  async setChannelGame(messageData: MessageData, game: string) {
    const gameId = await this.twitchGameService.getGameId(
      messageData.channelName,
      game,
    );
    if (gameId) {
      const result = await this.twitchChannelService.updateChannelInformation(
        messageData.channelName,
        null,
        gameId,
        null,
        null,
      );
      if (result) {
        return `${messageData.userState.username} changed the game to: "${game}"`;
      }
    }
    return `Unable to update Channel Game`;
  }

  async setChannelDelay(messageData: MessageData, delay: string) {
    const parsedDelay = parseInt(delay);
    if (!isNaN(parsedDelay)) {
      const result = await this.twitchChannelService.updateChannelInformation(
        messageData.channelName,
        null,
        null,
        parsedDelay,
        null,
      );
      if (result) {
        return `${messageData.userState.username} changed the delay to: "${delay}"`;
      }
    }
    return `Unable to update Channel Delay`;
  }

  async setChannelLanguage(messageData: MessageData, language: string) {
    const result = await this.twitchChannelService.updateChannelInformation(
      messageData.channelName,
      null,
      null,
      null,
      language,
    );
    if (result) {
      return `${messageData.userState.username} changed the language to: "${language}"`;
    }
    return `Unable to update Channel Language`;
  }

  async getChannelTitle(channelName: string): Promise<string> {
    const channelTitle = await this.twitchChannelService.getChannelInformation(
      channelName,
      ChannelInfo.title,
    );
    return `${channelName}'s title is "${channelTitle}"`;
  }

  async getChannelGame(channelName: string): Promise<string> {
    const channelGame = await this.twitchChannelService.getChannelInformation(
      channelName,
      ChannelInfo.game,
    );
    return `${channelName}'s game is ${channelGame}`;
  }

  async getChannelDelay(channelName: string): Promise<string> {
    const channelDelay = await this.twitchChannelService.getChannelInformation(
      channelName,
      ChannelInfo.delay,
    );
    return `${channelName}'s delay is ${channelDelay} seconds`;
  }

  async getChannelLanguage(channelName: string): Promise<string> {
    const channelLanguage =
      await this.twitchChannelService.getChannelInformation(
        channelName,
        ChannelInfo.language,
      );
    return `${channelName}'s language is ${channelLanguage}`;
  }
}
