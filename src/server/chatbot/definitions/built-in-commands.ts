import { CommandStatus } from '../../common/constants/command-status';

export const BuiltInCommands = [
  {
    command: '!moaitobot',
    description: 'Says information about MoaitoBot',
    status: CommandStatus.on,
  },
  {
    command: '!title',
    description: 'Says stream title',
    status: CommandStatus.on,
  },
  {
    command: '!game',
    description: 'Says stream game/category',
    status: CommandStatus.on,
  },
  {
    command: '!delay',
    description: 'Says stream current set delay',
    status: CommandStatus.on,
  },
  {
    command: '!language',
    description: 'Says stream current set language',
    status: CommandStatus.on,
  },
  {
    command: '!settitle',
    description: 'Updates stream title',
    status: CommandStatus.on,
  },
  {
    command: '!setgame',
    description: 'Updates stream game/category',
    status: CommandStatus.on,
  },
  {
    command: '!setdelay',
    description: 'Updates stream delay',
    status: CommandStatus.on,
  },
  {
    command: '!setlanguage',
    description: 'Updates stream language',
    status: CommandStatus.on,
  },
];
