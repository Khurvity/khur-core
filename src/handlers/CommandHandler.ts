import { Message } from 'discord.js';
import { isEmpty, isString } from 'lodash';

import { CommandHandlerConfig } from '../interfaces/handlers/Command';
import { CommandData, CommandDynamicInfo } from '../interfaces/structures/Command';

import { Bot } from '../core/Bot';
import { Commands } from '../core/Commands';
import { Khur } from '../core/Khur';
import { Request } from '../core/Request';
import { Translation } from '../core/Translation';
import { BaseCommand } from '../structures/BaseCommand';
import { MiddlewareHandler } from '../handlers/MiddlewareHandler';

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
      currentTranslation: Translation.getSupported()[0],
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
        commandData = commandData as CommandData;

        try {
          const beforeMiddlewares: boolean = await MiddlewareHandler.check({
            message,
            commandData,
            middlewares: customConfig.middlewares || [],
          });

          if (!beforeMiddlewares) {
            return;
          }

          const commandMiddlewares: boolean = await MiddlewareHandler.check({
            message,
            commandData,
            middlewares: commandData.config.middlewares || [],
          });

          if (!commandMiddlewares) {
            return;
          }
        } catch (error) {
          console.error(error);

          return;
        }

        try {
          const { command, config, path }: CommandData = commandData;
          const translation: Translation = new Translation(
            customConfig.currentTranslation || '',
            path
          );
          const target: BaseCommand = new (command as any)({
            bot,
            config,
            message,
            request,
            translation,
          });

          await target.handle();
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
