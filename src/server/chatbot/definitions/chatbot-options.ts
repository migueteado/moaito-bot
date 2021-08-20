export class ChatbotOptions {
  options: {
    debug: boolean;
  };

  connection: {
    reconnect: boolean;
    secure: boolean;
  };

  identity: {
    username: string;
    password: string;
  };

  channels: string[];

  constructor(
    debug: boolean,
    reconnect: boolean,
    secure: boolean,
    username: string,
    authKey: string,
    channels: string[],
  ) {
    this.options = { debug: debug };
    this.connection = { reconnect: reconnect, secure: secure };
    this.identity = { username: username, password: authKey };
    this.channels = channels;
  }
}
