
import { Message } from 'discord.js';

import { CommandConfig, CommandStructure } from '../interfaces/structures/Command';

import { Bot } from '../core/Bot';
import { Request } from '../core/Request';

/*
|--------------------------------------------------------------------------
| Structure: BaseCommand
|--------------------------------------------------------------------------
|
| ...
|
*/

export class BaseCommand implements CommandStructure {
  /**
   * Instance: Bot
   */
  protected bot: Bot;

  /**
   * Command config
   */
  protected config: CommandConfig;

  /**
   * Discord message
   */
  protected message: Message;

  /**
   * Message data
   */
  protected request: Request;

  constructor({
    bot,
    config,
    message,
    request,
  }: any) {
    this.bot = bot;
    this.config = config;
    this.message = message;
    this.request = request;
  }

  /**
   * Execute command
   * @return Promise<void>
   */
  public async handle(): Promise<void> {
    throw new Error('BaseCommand -> handle() method is not defined');
  }
}
