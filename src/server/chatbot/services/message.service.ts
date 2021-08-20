import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandStatus } from '../../common/constants/command-status';
import { CommandTypes } from '../../common/constants/command-types';
import { TimerStatus } from '../../common/constants/timer-status';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { MessageData } from '../definitions/message-data';
import { CustomCommandEntity } from '../entities/custom-command.entity';
import { TimerEntity } from '../entities/timer.entity';
import { ChatbotService } from './chatbot.service';
import { CustomCommandService } from './custom-command.service';
import { CooldownService } from './cooldown.service';
import { InputService } from './input.service';
import { LevelService } from './level.service';
import { BuiltInCommandService } from './built-in-command.service';
import { TimerService } from './timer.service';
import { BuiltInCommand } from '../definitions/built-in-command';
import { WordProtectionService } from './word-protection.service';
import { SymbolProtectionService } from './symbol-protection.service';
import { ParagraphProtectionService } from './paragraph-protection.service';
import { CapsProtectionService } from './caps-protection.service';
import { LinkProtectionService } from './link-protection.service';

@Injectable()
export class MessageService {
  private channelMessageAmounts;

  constructor(
    private inputService: InputService,
    @Inject(forwardRef(() => ChatbotService))
    private chatbotService: ChatbotService,
    private userService: UserService,
    private customCommandService: CustomCommandService,
    private levelService: LevelService,
    private cooldownService: CooldownService,
    private timerService: TimerService,
    private builtInCommandService: BuiltInCommandService,
    @Inject(forwardRef(() => WordProtectionService))
    private wordProtectionService: WordProtectionService,
    @Inject(forwardRef(() => SymbolProtectionService))
    private symbolProtectionService: SymbolProtectionService,
    @Inject(forwardRef(() => ParagraphProtectionService))
    private paragraphProtectionService: ParagraphProtectionService,
    @Inject(forwardRef(() => CapsProtectionService))
    private capsProtectionService: CapsProtectionService,
    @Inject(forwardRef(() => LinkProtectionService))
    private linkProtectionService: LinkProtectionService,
  ) {
    this.channelMessageAmounts = {};
  }

  registerMessage(messageData: MessageData) {
    if (!this.channelMessageAmounts[messageData.channelName]) {
      this.channelMessageAmounts[messageData.channelName] = [0, 0, 0, 0, 0];
    }
    this.channelMessageAmounts[messageData.channelName][
      this.channelMessageAmounts[messageData.channelName].length - 1
    ]++;
  }

  cleanMessages() {
    Object.keys(this.channelMessageAmounts).forEach((key) => {
      this.channelMessageAmounts[key].shift();
      this.channelMessageAmounts[key].push(0);
    });
  }

  async handleMessage(messageData: MessageData) {
    const paragraphPassed =
      await this.paragraphProtectionService.paragraphFilter(messageData);
    if (!paragraphPassed) return;

    const symbolPassed = await this.symbolProtectionService.symbolFilter(
      messageData,
    );
    if (!symbolPassed) return;

    const capsPassed = await this.capsProtectionService.capsFilter(messageData);
    if (!capsPassed) return;

    const linkPassed = await this.linkProtectionService.linkFilter(messageData);
    if (!linkPassed) return;

    const wordPassed = await this.wordProtectionService.wordFilter(messageData);
    if (!wordPassed) return;

    this.registerMessage(messageData);

    if (this.builtInCommandService.isBuiltInCommand(messageData)) {
      const command = await this.findBuiltInCommand(messageData);
      if (command.status !== CommandStatus.on) return;
      this.processBuiltInCommand(command, messageData);
      return;
    }

    const command = await this.findCommand(messageData);
    if (!command) return;
    if (command.status !== CommandStatus.on) return;
    if (!this.levelService.hasPermission(command, messageData)) return;
    if (!this.cooldownService.canProcessCommand(command, messageData)) return;

    this.processCommand(command, messageData);
    this.cooldownService.setCommandDate(command, messageData);
  }

  broadcastMessage(message: string) {
    const channels = this.chatbotService.getClient().getChannels();
    channels.forEach((channel) => this.sendMessage(channel.substr(1), message));
  }

  sendMessage(channelName: string, message: string) {
    this.chatbotService.getClient().say(channelName, message);
  }

  sendWhisper(userName: string, message: string) {
    this.chatbotService.getClient().whisper(userName, message);
  }

  formatMessage(message: string, messageData: MessageData): string {
    let formattedMessage = message;
    if (message.includes('{touser.name}')) {
      formattedMessage = formattedMessage
        .split('{touser.name}')
        .join(messageData.userState.displayName);
    }

    return formattedMessage;
  }

  timeoutUser(channelName, userName, time, reason) {
    this.sendMessage(channelName, `/timeout ${userName} ${time} ${reason}`);
  }

  banUser(channelName, userName, reason) {
    this.sendMessage(channelName, `/ban ${userName} ${reason}`);
  }

  async findCommand(messageData: MessageData) {
    let command: CustomCommandEntity;
    let parsedInput = this.inputService.parseInput(messageData.message);
    // is a command
    if (
      this.inputService.isValidCommand(parsedInput[0]) &&
      this.inputService.isValidCommandName(parsedInput[0].substr(1))
    ) {
      const user: UserEntity = await this.userService.findByLogin(
        messageData.channelName,
      );
      command = await this.customCommandService.findCommand(
        user,
        parsedInput[0],
      );

      // is not a command but may be an alias
      if (!command) {
        const commands: CustomCommandEntity[] =
          await this.customCommandService.findByUser(user);
        command = commands.find((command) =>
          command.aliases
            .split(',')
            .some((alias) => parsedInput.includes(alias)),
        );
      }
      // is not a command but may include a keyword
    } else {
      const user: UserEntity = await this.userService.findByLogin(
        messageData.channelName,
      );
      const commands: CustomCommandEntity[] =
        await this.customCommandService.findByUser(user);
      command = commands.find((command) =>
        command.keywords
          .split(',')
          .some((keyword) => parsedInput.includes(keyword)),
      );
    }

    return command;
  }

  async findBuiltInCommand(messageData: MessageData) {
    let command = new BuiltInCommand();
    let parsedInput = this.inputService.parseInput(messageData.message);
    if (
      this.inputService.isValidCommand(parsedInput[0]) &&
      this.inputService.isValidCommandName(parsedInput[0].substr(1))
    ) {
      const user: UserEntity = await this.userService.findByLogin(
        messageData.channelName,
      );
      const commands = await this.builtInCommandService.findByUser(user);
      command = commands.find((c) => c.command === parsedInput[0]);
    }
    return command;
  }

  private async processBuiltInCommand(
    command: BuiltInCommand,
    messageData: MessageData,
  ) {
    const message = await this.builtInCommandService.processBuiltInCommand(
      command,
      messageData,
    );
    this.sendMessage(messageData.channelName, message);
  }

  private processCommand(
    command: CustomCommandEntity,
    messageData: MessageData,
  ) {
    switch (command.commandType) {
      case CommandTypes.SIMPLE:
        this.processSimpleCommand(command, messageData);
        break;
      case CommandTypes.VARIANT:
        this.processVariantCommand(command, messageData);
        break;
      case CommandTypes.CHAIN:
        this.processChainCommand(command, messageData);
        break;
      default:
        this.processSimpleCommand(command, messageData);
        break;
    }
  }

  private processSimpleCommand(
    command: CustomCommandEntity,
    messageData: MessageData,
  ) {
    const response = command.response;

    let message = this.formatMessage(response, messageData);
    this.sendMessage(messageData.channelName, message);
  }

  private processVariantCommand(
    command: CustomCommandEntity,
    messageData: MessageData,
  ) {
    const responses = command.response.split('@@');
    const min = 0;
    const max = responses.length - 1;
    const response =
      responses[Math.floor(Math.random() * (max - min + 1)) + min];

    let message = this.formatMessage(response, messageData);
    this.sendMessage(messageData.channelName, message);
  }

  private processChainCommand(
    command: CustomCommandEntity,
    messageData: MessageData,
  ) {
    const responses = command.response.split('@@');

    responses.forEach((response) => {
      let message = this.formatMessage(response, messageData);
      this.sendMessage(messageData.channelName, message);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTimers() {
    const logins = Object.keys(this.channelMessageAmounts);
    const users = await Promise.all(
      logins.map(async (login): Promise<UserEntity> => {
        return this.userService.findByLogin(login);
      }),
    );

    users.forEach(this.processTimers.bind(this));

    this.cleanMessages();
  }

  private async processTimers(user: UserEntity) {
    const timers = await this.timerService.findByUser(user);
    timers.forEach((timer) => {
      this.handleTimer(user, timer);
    });
  }

  private handleTimer(user: UserEntity, timer: TimerEntity) {
    if (timer.status !== TimerStatus.on) return;
    if (!this.cooldownService.canProcessTimer(timer, user.login)) return;
    if (
      timer.chatMessages >
      this.channelMessageAmounts[user.login].reduce((acc, curr) => acc + curr)
    )
      return;
    this.processTimer(user.login, timer.message);
    this.cooldownService.setTimerDate(timer, user.login);
  }

  private processTimer(channelName: string, message: string) {
    this.sendMessage(channelName, message);
  }
}
