
import { Client } from 'discord.js';
import { isArrayLike, isEmpty, isFunction, isString } from 'lodash';

import { BotCredentials, KhurConfig } from '../interfaces/core/Khur';

import { Bot } from './Bot';
import { Kernel } from './Kernel';

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
   * Initialize all application configuration
   * @param config KhurConfig
   * @return Promise<void>
   */
  public static async config({
    appRoot,
    bot,
    discordClient,
    onReady,
  }: KhurConfig): Promise<void> {
    Khur.appRoot = appRoot;

    if (isEmpty(bot)) {
      throw new Error('Bot credentials are missing');
    }

    Khur.checkValidations(bot);

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

  private static checkValidations(bot: BotCredentials): void {
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
  }
}
