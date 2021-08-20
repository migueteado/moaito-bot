import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandTypes } from '../../common/constants/command-types';
import { UserLevels } from '../../common/constants/user-level';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { DeleteResult, Repository } from 'typeorm';
import {
  CreateCustomCommandDTO,
  UpdateCustomCommandDTO,
} from '../dtos/custom-command.dto';
import { CustomCommandEntity } from '../entities/custom-command.entity';
import { InputService } from './input.service';
import { CommandStatus } from '../../common/constants/command-status';

@Injectable()
export class CustomCommandService {
  constructor(
    @InjectRepository(CustomCommandEntity)
    private commandRepository: Repository<CustomCommandEntity>,
    private userService: UserService,
    private inputService: InputService,
  ) {}

  // Get One command
  async find(id: string): Promise<CustomCommandEntity> {
    const command: CustomCommandEntity = await this.commandRepository.findOne(
      id,
    );
    if (!command) {
      throw new NotFoundException(`Unable to find command for id ${id}`);
    }
    return command;
  }

  async findCommand(
    user: UserEntity,
    commandName: string,
  ): Promise<CustomCommandEntity> {
    const command = await this.commandRepository.findOne({
      user: user,
      command: commandName,
    });
    return command;
  }

  // Get commands By User
  async findByUser(user: UserEntity): Promise<CustomCommandEntity[]> {
    const commands: CustomCommandEntity[] = await this.commandRepository.find({
      user,
    });
    return commands;
  }

  // Create commands
  async create(data: CreateCustomCommandDTO): Promise<CustomCommandEntity> {
    if (this.inputService.isValidCommandName(data.command)) {
      throw new NotAcceptableException(
        `A valid command name consists of numbers and characters`,
      );
    }

    const user: UserEntity = await this.userService.find(data.userId);
    let newCommand = new CustomCommandEntity();
    newCommand.command = data.command;
    newCommand.description = data.description;
    newCommand.response = data.response.join('@@');
    newCommand.commandType = CommandTypes[data.commandType.toUpperCase()];
    newCommand.globalCooldown = data.globalCooldown;
    newCommand.userCooldown = data.userCooldown;
    newCommand.userLevel = UserLevels[data.userLevel.toUpperCase()];
    newCommand.aliases = data.aliases.join(',');
    newCommand.keywords = data.keywords.join(',');
    newCommand.status = CommandStatus[data.status];
    newCommand.user = user;
    const command = await this.commandRepository.create(newCommand);
    return this.commandRepository.save(command);
  }

  // Update commands
  async update(
    id: string,
    data: UpdateCustomCommandDTO,
  ): Promise<CustomCommandEntity> {
    if (data.command && this.inputService.isValidCommandName(data.command)) {
      throw new NotAcceptableException(
        `A valid command name consists of numbers and letters`,
      );
    }

    const oldCommand: CustomCommandEntity = await this.find(id);
    const updates = new CustomCommandEntity();
    updates.command = data.command || oldCommand.command;
    updates.description = data.description || oldCommand.description;
    if (data.response) {
      updates.response = data.response.join('@@');
    } else {
      updates.response = oldCommand.response;
    }

    if (data.commandType) {
      updates.commandType = CommandTypes[data.commandType.toUpperCase()];
    } else {
      updates.commandType = oldCommand.commandType;
    }

    if (data.userLevel) {
      updates.userLevel = UserLevels[data.userLevel.toUpperCase()];
    } else {
      updates.userLevel = oldCommand.userLevel;
    }

    if (data.aliases) {
      updates.aliases = data.aliases.join(',');
    } else {
      updates.aliases = oldCommand.aliases;
    }

    if (data.keywords) {
      updates.keywords = data.keywords.join(',');
    } else {
      updates.keywords = oldCommand.keywords;
    }

    if (data.status) {
      updates.status = CommandStatus[data.status];
    } else {
      updates.status = oldCommand.status;
    }

    updates.globalCooldown = data.globalCooldown || oldCommand.globalCooldown;
    updates.userCooldown = data.userCooldown || oldCommand.userCooldown;
    const command: CustomCommandEntity = await this.commandRepository.merge(
      oldCommand,
      updates,
    );
    return this.commandRepository.save(command);
  }

  // Delete commands
  async delete(id: string): Promise<DeleteResult> {
    const result = await this.commandRepository.delete(id);
    return result;
  }
}
