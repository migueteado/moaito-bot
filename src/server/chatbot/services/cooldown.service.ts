import { Injectable } from '@nestjs/common';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import {
  ChannelCommands,
  ChannelTimers,
  CommandDate,
  CommandDates,
  TimerDate,
  TimerDates,
  UserDate,
} from '../definitions/cooldown';
import { MessageData } from '../definitions/message-data';
import { CustomCommandEntity } from '../entities/custom-command.entity';
import { TimerEntity } from '../entities/timer.entity';

@Injectable()
export class CooldownService {
  private channelCommands: ChannelCommands;
  private channelTimers: ChannelTimers;

  constructor() {
    this.channelCommands = {};
    this.channelTimers = {};
  }

  // Check if command can be run
  canProcessCommand(command: CustomCommandEntity, messageData: MessageData) {
    if (!this.channelCommands[messageData.channelName]) return true;
    if (!this.channelCommands[messageData.channelName][command.id]) return true;

    const commandDate =
      this.channelCommands[messageData.channelName][command.id];
    const userDate = commandDate.userDates.find(
      (ud) => ud.username === messageData.userState.username,
    );

    return (
      checkGlobalCooldown(command, commandDate) &&
      checkUserCooldown(command, userDate)
    );

    function checkGlobalCooldown(
      command: CustomCommandEntity,
      commandDate?: CommandDate,
    ) {
      if (!commandDate) return true;
      const date = new Date();
      const lastExecution = commandDate.lastDate;
      return command.globalCooldown < differenceInSeconds(date, lastExecution);
    }

    function checkUserCooldown(
      command: CustomCommandEntity,
      userDate?: UserDate,
    ) {
      if (!userDate) return true;
      const date = new Date();
      const lastExecution = userDate.lastDate;
      return command.userCooldown < differenceInSeconds(date, lastExecution);
    }
  }

  // Check if timer can be run
  canProcessTimer(timer: TimerEntity, channelName: string) {
    if (!this.channelTimers[channelName]) return true;
    if (!this.channelTimers[channelName][timer.id]) return true;

    const date = new Date();
    const lastExecution = this.channelTimers[channelName][timer.id].lastDate;
    return timer.interval < differenceInMinutes(date, lastExecution);
  }

  // Set command last execution date
  setCommandDate(command: CustomCommandEntity, messageData: MessageData) {
    if (!this.channelCommands[messageData.channelName]) {
      this.channelCommands[messageData.channelName] = new CommandDates();
    }

    if (!this.channelCommands[messageData.channelName][command.id]) {
      this.channelCommands[messageData.channelName][command.id] =
        new CommandDate();
    }

    this.channelCommands[messageData.channelName][command.id].userDates =
      this.channelCommands[messageData.channelName][
        command.id
      ].userDates.filter(
        (ud) => ud.username !== messageData.userState.username,
      );

    const date = new Date();
    this.channelCommands[messageData.channelName][command.id].userDates.push(
      new UserDate(messageData.userState.username, date),
    );

    this.channelCommands[messageData.channelName][command.id].lastDate = date;
  }

  // Set Timer last execution date
  setTimerDate(timer: TimerEntity, channelName: string) {
    if (!this.channelTimers[channelName]) {
      this.channelTimers[channelName] = new TimerDates();
    }

    this.channelTimers[channelName][timer.id] = new TimerDate();
  }
}
