
import { GuildMember, Message } from 'discord.js';
import { isEmpty } from 'lodash';

import {
  CommandConfig,
  CommandConstructorParams,
  CommandStructure,
} from '../interfaces/structures/Command';

import { Bot } from '../core/Bot';
import { Request } from '../core/Request';
import { Translation } from '../core/Translation';

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

  protected translation: Translation;

  constructor({
    bot,
    config,
    message,
    request,
    translation,
  }: CommandConstructorParams) {
    this.bot = bot;
    this.config = config;
    this.message = message;
    this.request = request;
    this.translation = translation;
  }

  /**
   * Execute command
   * @return Promise<void>
   */
  public async handle(): Promise<void> {
    throw new Error('BaseCommand -> handle() method is not defined');
  }

  /**
   * Delete command use
   */
  public deleteCommandUse(): void {
    const isDM: boolean = this.message.channel.type === 'dm';

    if (!isDM) {
      BaseCommand.checkAndTryDeleteCommandUse(this.message);
    }
  }

  /**
   * [Base] Delete command use
   * @param message Message
   */
  public static checkAndTryDeleteCommandUse(message?: Message): void {
    if (!isEmpty(message)) {
      let botMember: GuildMember | null | undefined = message?.guild?.me;

      if (!isEmpty(botMember)) {
        botMember = <GuildMember> botMember;
        const canIDeleteMessages: boolean = (
          botMember.hasPermission('MANAGE_MESSAGES')
        );

        if (canIDeleteMessages) {
          message?.delete().catch((): void => {});
        }
      }
    }
  }
}
