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
  CreateCapsProtectionDTO,
  UpdateCapsProtectionDTO,
} from '../dtos/caps-protection.dto';
import { CapsProtectionEntity } from '../entities/caps-protection.entity';
import { LevelService } from './level.service';
import { MessageService } from './message.service';

const capsRegex = /^[A-Z]/g;

@Injectable()
export class CapsProtectionService {
  constructor(
    @InjectRepository(CapsProtectionEntity)
    private capsProtectionRepository: Repository<CapsProtectionEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private levelService: LevelService,
  ) {}

  async capsFilter(messageData: MessageData): Promise<boolean> {
    const user: UserEntity = await this.userService.findByLogin(
      messageData.channelName,
    );
    let capsProtection: CapsProtectionEntity = await this.findByUser(user);

    if (capsProtection.status === ToolStatus.off) return true;
    if (
      this.levelService.hasToolPermission(capsProtection.userLevel, messageData)
    )
      return true;

    const capsCount = messageData.message.replace(/[^A-Z]/g, '').length;

    if (capsCount < capsProtection.min) return true;
    const passed = capsCount < capsProtection.max;

    if (!passed) {
      if (capsProtection.punishment === PunishmentType.ban) {
        this.messageService.banUser(
          messageData.channelName,
          messageData.userState.username,
          'Used too many caps',
        );
      } else {
        this.messageService.timeoutUser(
          messageData.channelName,
          messageData.userState.username,
          capsProtection.punishmentTime,
          'Used too many caps',
        );
      }

      if (capsProtection.responseStatus === ResponseStatus.on) {
        this.messageService.sendMessage(
          messageData.channelName,
          this.messageService.formatMessage(
            capsProtection.response,
            messageData,
          ),
        );
      }
    }

    return passed;
  }

  // CRUD
  async find(id: string): Promise<CapsProtectionEntity> {
    const capsProtection = await this.capsProtectionRepository.findOne(id);
    if (!capsProtection) {
      throw new NotFoundException(`Caps Protection for id ${id} not found`);
    }
    return capsProtection;
  }

  async findByUser(user: UserEntity): Promise<CapsProtectionEntity> {
    const capsProtection = await this.capsProtectionRepository.findOne({
      user,
    });
    if (!capsProtection) {
      throw new NotFoundException(
        `Caps Protection for user ${user.login} not found`,
      );
    }
    return capsProtection;
  }

  async create(data: CreateCapsProtectionDTO): Promise<CapsProtectionEntity> {
    const user = await this.userService.find(data.userId);
    let newCapsProtection = new CapsProtectionEntity();
    newCapsProtection.max = data.max;
    newCapsProtection.min = data.min;
    newCapsProtection.punishment =
      PunishmentType[data.punishmentType.toLowerCase()];
    newCapsProtection.punishmentTime = data.punishmentTime;
    newCapsProtection.responseStatus =
      ResponseStatus[data.responseStatus.toLowerCase()];
    newCapsProtection.response = data.response;
    newCapsProtection.status = ToolStatus[data.status.toLowerCase()];
    newCapsProtection.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newCapsProtection.user = user;
    const capsProtection = await this.capsProtectionRepository.create(
      newCapsProtection,
    );
    return this.capsProtectionRepository.save(capsProtection);
  }

  async update(id: string, data: UpdateCapsProtectionDTO) {
    const oldCapsProtection = await this.find(id);
    let updates = new CapsProtectionEntity();
    updates.max = data.max || oldCapsProtection.max;
    updates.min = data.min || oldCapsProtection.min;
    updates.punishmentTime =
      data.punishmentTime || oldCapsProtection.punishmentTime;
    updates.response = data.response || oldCapsProtection.response;
    if (data.punishmentType) {
      updates.punishment = PunishmentType[data.punishmentType.toLowerCase()];
    } else {
      updates.punishment = oldCapsProtection.punishment;
    }

    if (data.responseStatus) {
      updates.responseStatus =
        ResponseStatus[data.responseStatus.toLowerCase()];
    } else {
      updates.responseStatus = oldCapsProtection.responseStatus;
    }

    if (data.status) {
      updates.status = ToolStatus[data.status.toLowerCase()];
    } else {
      updates.status = oldCapsProtection.status;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldCapsProtection.userLevel;
    }
    const capsProtection = await this.capsProtectionRepository.merge(
      oldCapsProtection,
      updates,
    );
    return this.capsProtectionRepository.save(capsProtection);
  }

  async findOrCreate(user: UserEntity): Promise<CapsProtectionEntity> {
    try {
      const capsProtection = await this.findByUser(user);
      return capsProtection;
    } catch (error) {
      return this.create({
        max: 60,
        min: 10,
        punishmentType: 'timeout',
        punishmentTime: 10,
        responseStatus: 'on',
        response: '{touser.name} -> Please stop writing in caps',
        status: ToolStatus.off,
        userLevel: UserLevels.MODERATOR,
        userId: user.id,
      });
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.capsProtectionRepository.delete(id);
    return result;
  }
}
