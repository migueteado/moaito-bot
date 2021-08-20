import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PunishmentType } from '../../common/constants/punishment-type';
import { ResponseStatus } from '../../common/constants/response-status';
import { ToolStatus } from '../../common/constants/tool-status';
import { UserLevels } from '../../common/constants/user-level';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { MessageData } from '../definitions/message-data';
import {
  CreateParagraphProtectionDTO,
  UpdateParagraphProtectionDTO,
} from '../dtos/paragraph-protection.dto';
import { ParagraphProtectionEntity } from '../entities/paragraph-protection.entity';
import { LevelService } from './level.service';
import { MessageService } from './message.service';

@Injectable()
export class ParagraphProtectionService {
  constructor(
    @InjectRepository(ParagraphProtectionEntity)
    private paragraphProtectionRepository: Repository<ParagraphProtectionEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private levelService: LevelService,
  ) {}

  async paragraphFilter(messageData: MessageData): Promise<boolean> {
    const user: UserEntity = await this.userService.findByLogin(
      messageData.channelName,
    );
    let paragraphProtection: ParagraphProtectionEntity = await this.findByUser(
      user,
    );

    if (paragraphProtection.status === ToolStatus.off) return true;
    if (
      this.levelService.hasToolPermission(
        paragraphProtection.userLevel,
        messageData,
      )
    )
      return true;

    const passed = messageData.message.length < paragraphProtection.max;

    if (!passed) {
      if (paragraphProtection.punishment === PunishmentType.ban) {
        this.messageService.banUser(
          messageData.channelName,
          messageData.userState.username,
          'Message is too long',
        );
      } else {
        this.messageService.timeoutUser(
          messageData.channelName,
          messageData.userState.username,
          paragraphProtection.punishmentTime,
          'Message is too long',
        );
      }

      if (paragraphProtection.responseStatus === ResponseStatus.on) {
        this.messageService.sendMessage(
          messageData.channelName,
          this.messageService.formatMessage(
            paragraphProtection.response,
            messageData,
          ),
        );
      }
    }

    return passed;
  }

  // CRUD
  async find(id: string): Promise<ParagraphProtectionEntity> {
    const paragraphProtection =
      await this.paragraphProtectionRepository.findOne(id);
    if (!paragraphProtection) {
      throw new NotFoundException(
        `Paragraph Protection for id ${id} not found`,
      );
    }
    return paragraphProtection;
  }

  async findByUser(user: UserEntity): Promise<ParagraphProtectionEntity> {
    const paragraphProtection =
      await this.paragraphProtectionRepository.findOne({
        user,
      });
    if (!paragraphProtection) {
      throw new NotFoundException(
        `Paragraph Protection for user ${user.login} not found`,
      );
    }
    return paragraphProtection;
  }

  async create(
    data: CreateParagraphProtectionDTO,
  ): Promise<ParagraphProtectionEntity> {
    const user = await this.userService.find(data.userId);
    let newParagraphProtection = new ParagraphProtectionEntity();
    newParagraphProtection.max = data.max;
    newParagraphProtection.punishment =
      PunishmentType[data.punishmentType.toLowerCase()];
    newParagraphProtection.punishmentTime = data.punishmentTime;
    newParagraphProtection.responseStatus =
      ResponseStatus[data.responseStatus.toLowerCase()];
    newParagraphProtection.response = data.response;
    newParagraphProtection.status = ToolStatus[data.status.toLowerCase()];
    newParagraphProtection.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newParagraphProtection.user = user;
    const capsProtection = await this.paragraphProtectionRepository.create(
      newParagraphProtection,
    );
    return this.paragraphProtectionRepository.save(capsProtection);
  }

  async update(id: string, data: UpdateParagraphProtectionDTO) {
    const oldParagraphProtection = await this.find(id);
    let updates = new ParagraphProtectionEntity();
    updates.max = data.max || oldParagraphProtection.max;
    updates.punishmentTime =
      data.punishmentTime || oldParagraphProtection.punishmentTime;
    updates.response = data.response || oldParagraphProtection.response;

    if (data.responseStatus) {
      updates.responseStatus =
        ResponseStatus[data.responseStatus.toLowerCase()];
    } else {
      updates.responseStatus = oldParagraphProtection.responseStatus;
    }

    if (data.punishmentType) {
      updates.punishment = PunishmentType[data.punishmentType.toLowerCase()];
    } else {
      updates.punishment = oldParagraphProtection.punishment;
    }

    if (data.status) {
      updates.status = ToolStatus[data.status.toLowerCase()];
    } else {
      updates.status = oldParagraphProtection.status;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldParagraphProtection.userLevel;
    }
    const paragraphProtection = await this.paragraphProtectionRepository.merge(
      oldParagraphProtection,
      updates,
    );
    return this.paragraphProtectionRepository.save(paragraphProtection);
  }

  async findOrCreate(user: UserEntity): Promise<ParagraphProtectionEntity> {
    try {
      const paragraphProtection = await this.findByUser(user);
      return paragraphProtection;
    } catch (error) {
      return this.create({
        max: 140,
        punishmentType: 'timeout',
        punishmentTime: 10,
        responseStatus: 'on',
        response: '{touser.name} -> Please stop writing long texts',
        status: ToolStatus.off,
        userLevel: UserLevels.MODERATOR,
        userId: user.id,
      });
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.paragraphProtectionRepository.delete(id);
    return result;
  }
}
