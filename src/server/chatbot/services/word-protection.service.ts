import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ResponseStatus } from '../../common/constants/response-status';
import { ToolStatus } from '../../common/constants/tool-status';
import { UserLevels } from '../../common/constants/user-level';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { MessageData } from '../definitions/message-data';
import {
  CreateWordProtectionDTO,
  UpdateWordProtectionDTO,
} from '../dtos/word-protection.dto';
import { WordProtectionEntity } from '../entities/word-protection.entity';
import { LevelService } from './level.service';
import { MessageService } from './message.service';

@Injectable()
export class WordProtectionService {
  constructor(
    @InjectRepository(WordProtectionEntity)
    private wordProtectionRepository: Repository<WordProtectionEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private levelService: LevelService,
  ) {}

  async wordFilter(messageData: MessageData): Promise<boolean> {
    const user: UserEntity = await this.userService.findByLogin(
      messageData.channelName,
    );
    let wordProtection: WordProtectionEntity = await this.findByUser(user);

    if (wordProtection.status === ToolStatus.off) return true;
    if (
      this.levelService.hasToolPermission(wordProtection.userLevel, messageData)
    )
      return true;

    const passed = !wordProtection.blacklist
      .split(',')
      .some((bl) =>
        messageData.message.toLowerCase().includes(bl.toLowerCase()),
      );

    if (!passed) {
      this.messageService.timeoutUser(
        messageData.channelName,
        messageData.userState.username,
        10,
        'Said a blacklisted word',
      );

      if (wordProtection.responseStatus === ResponseStatus.on) {
        this.messageService.sendMessage(
          messageData.channelName,
          this.messageService.formatMessage(
            wordProtection.response,
            messageData,
          ),
        );
      }
    }

    return passed;
  }

  // CRUD
  async find(id: string): Promise<WordProtectionEntity> {
    const wordProtection = await this.wordProtectionRepository.findOne(id);
    if (!wordProtection) {
      throw new NotFoundException(`Word Protection for id ${id} not found`);
    }
    return wordProtection;
  }

  async findByUser(user: UserEntity): Promise<WordProtectionEntity> {
    const wordProtection = await this.wordProtectionRepository.findOne({
      user,
    });
    if (!wordProtection) {
      throw new NotFoundException(
        `Word Protection for user ${user.login} not found`,
      );
    }
    return wordProtection;
  }

  async create(data: CreateWordProtectionDTO): Promise<WordProtectionEntity> {
    const user = await this.userService.find(data.userId);
    let newWordProtection = new WordProtectionEntity();
    newWordProtection.responseStatus =
      ResponseStatus[data.responseStatus.toLowerCase()];
    newWordProtection.response = data.response;
    newWordProtection.blacklist = data.blacklist.join(',');
    newWordProtection.status = ToolStatus[data.status.toLowerCase()];
    newWordProtection.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newWordProtection.user = user;
    const capsProtection = await this.wordProtectionRepository.create(
      newWordProtection,
    );
    return this.wordProtectionRepository.save(capsProtection);
  }

  async update(id: string, data: UpdateWordProtectionDTO) {
    const oldWordProtection = await this.find(id);
    let updates = new WordProtectionEntity();
    updates.response = data.response || oldWordProtection.response;

    if (data.responseStatus) {
      updates.responseStatus =
        ResponseStatus[data.responseStatus.toLowerCase()];
    } else {
      updates.responseStatus = oldWordProtection.responseStatus;
    }

    if (data.blacklist) {
      updates.blacklist = data.blacklist.join(',');
    } else {
      updates.blacklist = oldWordProtection.blacklist;
    }

    if (data.status) {
      updates.status = ToolStatus[data.status.toLowerCase()];
    } else {
      updates.status = oldWordProtection.status;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldWordProtection.userLevel;
    }
    const wordProtection = await this.wordProtectionRepository.merge(
      oldWordProtection,
      updates,
    );
    return this.wordProtectionRepository.save(wordProtection);
  }

  async findOrCreate(user: UserEntity): Promise<WordProtectionEntity> {
    try {
      const wordProtection = await this.findByUser(user);
      return wordProtection;
    } catch (error) {
      return this.create({
        responseStatus: 'on',
        response: '{touser.name} -> Please stop using forbidden words',
        blacklist: [],
        status: ToolStatus.off,
        userLevel: UserLevels.MODERATOR,
        userId: user.id,
      });
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.wordProtectionRepository.delete(id);
    return result;
  }
}
