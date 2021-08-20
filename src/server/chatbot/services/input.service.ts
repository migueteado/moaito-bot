import { Injectable } from '@nestjs/common';

@Injectable()
export class InputService {
  parseInput(message: string): string[] {
    return message.split(' ').filter((word) => word !== '');
  }

  isValidCommand(message: string): boolean {
    return message.startsWith('!') && this.checkWhitespaces(message);
  }

  isValidCommandName(commandName: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(commandName);
  }

  private checkWhitespaces(input: string): boolean {
    return /\S/.test(input.slice(1, input.length)) && input.charAt(1) !== ' ';
  }
}
