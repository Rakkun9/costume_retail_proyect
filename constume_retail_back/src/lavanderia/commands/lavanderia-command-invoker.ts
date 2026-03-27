import { Command } from '../../patrones/command/command.interface';

export class LavanderiaCommandInvoker {
  async execute<TResult>(command: Command<TResult>): Promise<TResult> {
    return command.execute();
  }
}
