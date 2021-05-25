
import { Client } from 'discord.js';
import { isArrayLike, isEmpty, isFunction, isString } from 'lodash';

import { BotCredentials, KhurConfig } from '../interfaces/core/Khur';

import { Bot } from './Bot';
import { Kernel } from './Kernel';
import { Translation } from './Translation';

/*
|--------------------------------------------------------------------------
| Core: Khur
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Khur extends Kernel {
  /**
   * Application path
   */
  private static appRoot: string;

  /**
   * Default prefix
   */
  private static defaultPrefix: string;

  /**
   * Initialize all application configuration
   * @param config KhurConfig
   * @return Promise<void>
   */
  public static async config({
    appRoot,
    bot,
    defaultPrefix,
    discordClient,
    i18n,
    onReady,
  }: KhurConfig): Promise<void> {
    Khur.appRoot = appRoot;
    Khur.defaultPrefix = defaultPrefix;

    if (isEmpty(bot)) {
      throw new Error('Bot credentials are missing');
    }

    Khur.checkValidations(bot, i18n);

    Translation.setSupported(i18n?.supported);
    Translation.setGlobalPath(i18n?.globalTranslationsPath);

    try {
      Bot.setClient(discordClient);

      const client: Client = Bot.getClient();

      await Khur.initializeEvents();

      client.login(bot.token)
        .then((): void => {
          if (isFunction(onReady)) {
            onReady(client).catch((): void => {});
          }
        })
        .catch((error: any): void => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Getting application path
   * @return string
   */
  public static getAppRoot(): string {
    return Khur.appRoot;
  }

  /**
   * Getting default prefix
   * @return string
   */
  public static getDefaultPrefix(): string {
    return Khur.defaultPrefix;
  }

  /**
   * Validate bot credentials
   * @param bot BotCredentials
   */
  private static checkValidations(bot: BotCredentials, i18n: any): void {
    if (isEmpty(bot.client) || isEmpty(bot.client?.id) || isEmpty(bot.client?.secret)) {
      throw new Error('Client credentials are missing');
    }

    if (isEmpty(bot.token) || !isString(bot.token)) {
      throw new Error('Property {token} is required');
    }

    if (isEmpty(bot.scopes) || !isArrayLike(bot.scopes)) {
      throw new Error('Property {scopes} is required');
    }

    if (isEmpty(bot.permissions) || !isString(bot.permissions)) {
      throw new Error('Property {permissions} is required');
    }

    if (isEmpty(i18n) || !isArrayLike(i18n?.supported)) {
      throw new Error('Property {i18n} is required');
    }
  }
}
