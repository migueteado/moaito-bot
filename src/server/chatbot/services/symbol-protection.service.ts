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
  CreateSymbolProtectionDTO,
  UpdateSymbolProtectionDTO,
} from '../dtos/symbol-protection.dto';
import { SymbolProtectionEntity } from '../entities/symbol-protection.entity';
import { LevelService } from './level.service';
import { MessageService } from './message.service';

const antiSymbolRegex = /[^a-zA-Z0-9 ]/g;

@Injectable()
export class SymbolProtectionService {
  constructor(
    @InjectRepository(SymbolProtectionEntity)
    private symbolProtectionRepository: Repository<SymbolProtectionEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private levelService: LevelService,
  ) {}

  async symbolFilter(messageData: MessageData): Promise<boolean> {
    const user: UserEntity = await this.userService.findByLogin(
      messageData.channelName,
    );
    let symbolProtection: SymbolProtectionEntity = await this.findByUser(user);

    if (symbolProtection.status === ToolStatus.off) return true;
    if (
      this.levelService.hasToolPermission(
        symbolProtection.userLevel,
        messageData,
      )
    )
      return true;

    const symbolArray = [...messageData.message.matchAll(antiSymbolRegex)];
    const symbolCount = symbolArray.length;

    if (symbolCount < symbolProtection.min) return true;
    const passed = symbolCount < symbolProtection.max;

    if (!passed) {
      if (symbolProtection.punishment === PunishmentType.ban) {
        this.messageService.banUser(
          messageData.channelName,
          messageData.userState.username,
          'Used too many symbols',
        );
      } else {
        this.messageService.timeoutUser(
          messageData.channelName,
          messageData.userState.username,
          symbolProtection.punishmentTime,
          'Used too many symbols',
        );
      }

      if (symbolProtection.responseStatus === ResponseStatus.on) {
        this.messageService.sendMessage(
          messageData.channelName,
          this.messageService.formatMessage(
            symbolProtection.response,
            messageData,
          ),
        );
      }
    }

    return passed;
  }

  // CRUD
  async find(id: string): Promise<SymbolProtectionEntity> {
    const symbolProtection = await this.symbolProtectionRepository.findOne(id);
    if (!symbolProtection) {
      throw new NotFoundException(`Symbol Protection for id ${id} not found`);
    }
    return symbolProtection;
  }

  async findByUser(user: UserEntity): Promise<SymbolProtectionEntity> {
    const symbolProtection = await this.symbolProtectionRepository.findOne({
      user,
    });
    if (!symbolProtection) {
      throw new NotFoundException(
        `Symbol Protection for user ${user.login} not found`,
      );
    }
    return symbolProtection;
  }

  async create(
    data: CreateSymbolProtectionDTO,
  ): Promise<SymbolProtectionEntity> {
    const user = await this.userService.find(data.userId);
    let newSymbolProtection = new SymbolProtectionEntity();
    newSymbolProtection.max = data.max;
    newSymbolProtection.min = data.min;
    newSymbolProtection.punishment =
      PunishmentType[data.punishmentType.toLowerCase()];
    newSymbolProtection.punishmentTime = data.punishmentTime;
    newSymbolProtection.responseStatus =
      ResponseStatus[data.responseStatus.toLowerCase()];
    newSymbolProtection.response = data.response;
    newSymbolProtection.status = ToolStatus[data.status.toLowerCase()];
    newSymbolProtection.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newSymbolProtection.user = user;
    const capsProtection = await this.symbolProtectionRepository.create(
      newSymbolProtection,
    );
    return this.symbolProtectionRepository.save(capsProtection);
  }

  async update(id: string, data: UpdateSymbolProtectionDTO) {
    const oldSymbolProtection = await this.find(id);
    let updates = new SymbolProtectionEntity();
    updates.max = data.max || oldSymbolProtection.max;
    updates.punishmentTime =
      data.punishmentTime || oldSymbolProtection.punishmentTime;
    updates.response = data.response || oldSymbolProtection.response;

    if (data.responseStatus) {
      updates.responseStatus =
        ResponseStatus[data.responseStatus.toLowerCase()];
    } else {
      updates.responseStatus = oldSymbolProtection.responseStatus;
    }
    if (data.punishmentType) {
      updates.punishment = PunishmentType[data.punishmentType.toLowerCase()];
    } else {
      updates.punishment = oldSymbolProtection.punishment;
    }

    if (data.status) {
      updates.status = ToolStatus[data.status.toLowerCase()];
    } else {
      updates.status = oldSymbolProtection.status;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldSymbolProtection.userLevel;
    }
    const symbolProtection = await this.symbolProtectionRepository.merge(
      oldSymbolProtection,
      updates,
    );
    return this.symbolProtectionRepository.save(symbolProtection);
  }

  async findOrCreate(user: UserEntity): Promise<SymbolProtectionEntity> {
    try {
      const symbolProtection = await this.findByUser(user);
      return symbolProtection;
    } catch (error) {
      return this.create({
        min: 10,
        max: 30,
        punishmentType: 'timeout',
        punishmentTime: 10,
        responseStatus: 'on',
        response: '{touser.name} -> Please stop writing symbols',
        status: ToolStatus.off,
        userLevel: UserLevels.MODERATOR,
        userId: user.id,
      });
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.symbolProtectionRepository.delete(id);
    return result;
  }
}
