import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class RewardsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any): any {
    console.log(data);
    return data;
  }
}
