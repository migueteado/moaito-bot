export class UserDate {
  username: string;
  lastDate: Date;

  constructor(username: string, lastDate: Date) {
    this.username = username;
    this.lastDate = lastDate;
  }
}

export class TimerDate {
  lastDate: Date;

  constructor() {
    this.lastDate = new Date();
  }
}

export class CommandDate {
  lastDate: Date;
  userDates: UserDate[];

  constructor() {
    this.lastDate = new Date();
    this.userDates = [];
  }
}

export class CommandDates {
  [key: string]: CommandDate;
}

export class TimerDates {
  [key: string]: TimerDate;
}

export class ChannelCommands {
  [key: string]: CommandDates;
}

export class ChannelTimers {
  [key: string]: TimerDates;
}
