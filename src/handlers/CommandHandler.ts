
import { Message } from 'discord.js';
import { isEmpty, isString } from 'lodash';

import { CommandHandlerConfig } from '../interfaces/handlers/Command';
import { CommandData, CommandDynamicInfo } from '../interfaces/structures/Command';

import { Bot } from '../core/Bot';
import { Commands } from '../core/Commands';
import { Khur } from '../core/Khur';
import { Request } from '../core/Request';

/*
|--------------------------------------------------------------------------
| Handler: Commands
|--------------------------------------------------------------------------
|
| ...
|
*/

export class CommandHandler {
  /**
   * Initialize handler
   * @param message Message
   * @param config CommandHandlerConfig
   * @return Promise<void>
   */
  public static async init(message: Message, config?: CommandHandlerConfig): Promise<void> {
    const customConfig: CommandHandlerConfig = {
      prefix: Khur.getDefaultPrefix(),
      ...config,
    };

    if (isEmpty(customConfig.prefix) || !isString(customConfig.prefix)) {
      throw new Error('Command handler needs {config.prefix} property');
    }

    const bot: Bot = new Bot(customConfig.prefix);
    const request: Request = new Request(bot, message);

    const validations: boolean = ![
      Request.isCommand(bot.getPrefix(), message.content),
      !message.author.bot,
    ].includes(false);

    if (validations) {
      const currentCommand: string = request.data().command;
      let commandData: CommandData | undefined;

      if (Commands.has(currentCommand)) {
        commandData = Commands.get(currentCommand);
      } else {
        const checkDynamic: CommandDynamicInfo = Commands.hasDynamicAliases(request.data().command);

        if (checkDynamic.validation) {
          commandData = checkDynamic.commandData;
        }
      }

      if (!isEmpty(commandData)) {
        if (!Bot.getStatus()) {
          return;
        }

        console.log('Run command ->', commandData);
      }
    }
  }
}
