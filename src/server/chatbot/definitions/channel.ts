import { MessageService } from '../services/message.service';
import { MessageData } from './message-data';

export class Channel {
  public name: string;
  public messageService: MessageService;

  constructor(name: string, messageService: MessageService) {
    this.name = name;
    this.messageService = messageService;
  }

  public handleMessage(messageData: MessageData) {
    this.messageService.handleMessage(messageData);
  }
}
