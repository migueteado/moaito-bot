import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as tmi from 'tmi.js';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ChatbotStatus } from '../../common/constants/chatbot-status';
import config from '../../config';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { ChatbotOptions } from '../definitions/chatbot-options';
import { CreateChatbotDTO, UpdateChatbotDTO } from '../dtos/chatbot.dto';
import { ChatbotEntity } from '../entities/chatbot.entity';
import { MessageData } from '../definitions/message-data';
import { MessageType } from '../definitions/message-type';
import { ChannelService } from './channel.service';

@Injectable()
export class ChatbotService {
  private client: tmi.Client;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(ChatbotEntity)
    private chatbotRepository: Repository<ChatbotEntity>,
    private userService: UserService,
    private channelService: ChannelService,
  ) {}

  async init() {
    const channels = await this.getChannelsFromRepository();
    const options = new ChatbotOptions(
      true,
      true,
      true,
      this.configService.chatbot.username,
      this.configService.chatbot.token,
      channels,
    );

    this.generateChannels(options);
    this.client = new tmi.Client(options);
    this.client.on('message', this.messageHandler.bind(this));
  }

  connect(): void {
    this.client
      .connect()
      .then((data) => this.logInfo(`Connected to ${data[0]}:${data[1]}`))
      .catch((error) => this.logError(error));
  }

  disconnect(): void {
    this.client.disconnect().catch((error) => this.logError(error));
  }

  joinOrPartChannel(channel: string, status: ChatbotStatus): void {
    if (status === ChatbotStatus.on) {
      this.channelService.addChannel(channel);
      this.client.join(channel).catch((error) => this.logError(error));
    } else {
      this.channelService.removeChannel(channel);
      this.client.part(channel).catch((error) => this.logError(error));
    }
  }

  getChannels(): string[] {
    return this.client.getChannels();
  }

  getClient(): tmi.Client {
    return this.client;
  }

  generateChannels(options: ChatbotOptions): void {
    options.channels.forEach((channel) => {
      this.channelService.addChannel(channel);
    });
  }

  messageHandler(channel, userstate, message, self): void {
    let messageData = new MessageData(channel, userstate, message, self);
    if (messageData.self) return;
    switch (messageData.userState.messageType) {
      case MessageType.action:
        this.channelService.channels
          .find((channel) => channel.name === messageData.channelName)
          .handleMessage(messageData);
        break;
      case MessageType.chat:
        this.channelService.channels
          .find((channel) => channel.name === messageData.channelName)
          .handleMessage(messageData);
        break;
      case MessageType.whisper:
        break;
      default:
        break;
    }
  }

  async getChannelsFromRepository(): Promise<string[]> {
    const chatbots: ChatbotEntity[] = await this.findAll();
    const channels = chatbots
      .filter((chatbot) => chatbot.status === ChatbotStatus.on)
      .map((chatbot) => chatbot.user.login);
    return channels;
  }

  // Chatbot CRUD
  async find(id: string): Promise<ChatbotEntity> {
    const chatbot: ChatbotEntity = await this.chatbotRepository.findOne(id, {
      relations: ['user'],
    });
    if (!chatbot) {
      throw new NotFoundException(`Unable to find chatbot for id ${id}`);
    }
    return chatbot;
  }

  async findAll(): Promise<ChatbotEntity[]> {
    const chatbots: ChatbotEntity[] = await this.chatbotRepository.find({
      relations: ['user'],
    });
    if (!(chatbots.length > 0)) {
      // throw new NotFoundException('No chatbots found');
    }
    return chatbots;
  }

  async findByUser(user: UserEntity): Promise<ChatbotEntity> {
    const chatbot: ChatbotEntity = await this.chatbotRepository.findOne({
      user,
    });
    if (!chatbot) {
      throw new NotFoundException(`Unable to find chatbot for user ${user.id}`);
    }
    return chatbot;
  }

  async create(data: CreateChatbotDTO): Promise<ChatbotEntity> {
    const user: UserEntity = await this.userService.find(data.userId);
    let newChatbot = new ChatbotEntity();
    newChatbot.status = ChatbotStatus[data.status];
    newChatbot.user = user;
    const chatbot: ChatbotEntity = await this.chatbotRepository.create(
      newChatbot,
    );
    this.joinOrPartChannel(chatbot.user.login, chatbot.status);
    return this.chatbotRepository.save(chatbot);
  }

  async update(id: string, data: UpdateChatbotDTO): Promise<ChatbotEntity> {
    const oldChatbot: ChatbotEntity = await this.find(id);
    const updates = new ChatbotEntity();
    updates.status = ChatbotStatus[data.status] || oldChatbot.status;
    const chatbot: ChatbotEntity = await this.chatbotRepository.merge(
      oldChatbot,
      updates,
    );
    this.joinOrPartChannel(chatbot.user.login, chatbot.status);
    return this.chatbotRepository.save(chatbot);
  }

  async updateOrCreate(data: CreateChatbotDTO): Promise<ChatbotEntity> {
    try {
      const user: UserEntity = await this.userService.find(data.userId);
      const oldChatbot: ChatbotEntity = await this.findByUser(user);
      const chatbot: ChatbotEntity = await this.update(oldChatbot.id, data);
      return chatbot;
    } catch (error) {
      const chatbot: ChatbotEntity = await this.create(data);
      return chatbot;
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result: DeleteResult = await this.chatbotRepository.delete(id);
    return result;
  }

  //Logs
  logInfo(data) {
    console.log('[MoaitoBot]', data);
  }

  logError(error) {
    console.log('[MoaitoBot]', error);
  }
}
