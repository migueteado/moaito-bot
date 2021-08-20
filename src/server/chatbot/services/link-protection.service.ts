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
  CreateLinkProtectionDTO,
  UpdateLinkProtectionDTO,
} from '../dtos/link-protection.dto';
import { LinkProtectionEntity } from '../entities/link-protection.entity';
import { InputService } from './input.service';
import { LevelService } from './level.service';
import { MessageService } from './message.service';

const urlRegex = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
); // fragment locator

@Injectable()
export class LinkProtectionService {
  constructor(
    @InjectRepository(LinkProtectionEntity)
    private linkProtectionRepository: Repository<LinkProtectionEntity>,
    private userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private levelService: LevelService,
    private inputService: InputService,
  ) {}

  async linkFilter(messageData: MessageData): Promise<boolean> {
    const user: UserEntity = await this.userService.findByLogin(
      messageData.channelName,
    );
    let linkProtection: LinkProtectionEntity = await this.findByUser(user);

    if (linkProtection.status === ToolStatus.off) return true;
    if (
      this.levelService.hasToolPermission(linkProtection.userLevel, messageData)
    )
      return true;

    const whitelist = linkProtection.whitelist.split(',');
    const links = [];
    const parsedInput = this.inputService.parseInput(messageData.message);
    parsedInput.forEach((pi) => {
      if (pi.match(urlRegex) && !whitelist.includes(pi)) {
        links.push(pi);
      }
    });

    const passed = links.length <= 0;

    if (!passed) {
      this.messageService.timeoutUser(
        messageData.channelName,
        messageData.userState.username,
        10,
        'Sent a not permitted link.',
      );

      if (linkProtection.responseStatus === ResponseStatus.on) {
        this.messageService.sendMessage(
          messageData.channelName,
          this.messageService.formatMessage(
            linkProtection.response,
            messageData,
          ),
        );
      }
    }

    return passed;
  }

  // CRUD
  async find(id: string): Promise<LinkProtectionEntity> {
    const linkProtection = await this.linkProtectionRepository.findOne(id);
    if (!linkProtection) {
      throw new NotFoundException(`Link Protection for id ${id} not found`);
    }
    return linkProtection;
  }

  async findByUser(user: UserEntity): Promise<LinkProtectionEntity> {
    const linkProtection = await this.linkProtectionRepository.findOne({
      user,
    });
    if (!linkProtection) {
      throw new NotFoundException(
        `Link Protection for user ${user.login} not found`,
      );
    }
    return linkProtection;
  }

  async create(data: CreateLinkProtectionDTO): Promise<LinkProtectionEntity> {
    const user = await this.userService.find(data.userId);
    let newLinkProtection = new LinkProtectionEntity();
    newLinkProtection.responseStatus =
      ResponseStatus[data.responseStatus.toLowerCase()];
    newLinkProtection.response = data.response;
    newLinkProtection.whitelist = data.whitelist.join(',');
    newLinkProtection.status = ToolStatus[data.status.toLowerCase()];
    newLinkProtection.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newLinkProtection.user = user;
    const capsProtection = await this.linkProtectionRepository.create(
      newLinkProtection,
    );
    return this.linkProtectionRepository.save(capsProtection);
  }

  async update(id: string, data: UpdateLinkProtectionDTO) {
    const oldLinkProtection = await this.find(id);
    let updates = new LinkProtectionEntity();
    updates.response = data.response || oldLinkProtection.response;

    if (data.responseStatus) {
      updates.responseStatus =
        ResponseStatus[data.responseStatus.toLowerCase()];
    } else {
      updates.responseStatus = oldLinkProtection.responseStatus;
    }

    if (data.status) {
      updates.status = ToolStatus[data.status.toLowerCase()];
    } else {
      updates.status = oldLinkProtection.status;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldLinkProtection.userLevel;
    }

    if (data.whitelist) {
      updates.whitelist = data.whitelist.join(',');
    } else {
      updates.whitelist = oldLinkProtection.whitelist;
    }

    const linkProtection = await this.linkProtectionRepository.merge(
      oldLinkProtection,
      updates,
    );
    return this.linkProtectionRepository.save(linkProtection);
  }

  async findOrCreate(user: UserEntity): Promise<LinkProtectionEntity> {
    try {
      const linkProtection = await this.findByUser(user);
      return linkProtection;
    } catch (error) {
      return this.create({
        responseStatus: 'on',
        response: '{touser.name} -> Please stop writing symbols',
        whitelist: [],
        status: ToolStatus.off,
        userLevel: UserLevels.MODERATOR,
        userId: user.id,
      });
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.linkProtectionRepository.delete(id);
    return result;
  }
}
