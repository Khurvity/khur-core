import { isEmpty, isFunction, isString } from 'lodash';

import { RegisterDefaultConfig, RegisterGroupParams } from '../interfaces/core/Register';
import { CommandConfig } from '../interfaces/structures/Command';

import { BaseCommand } from '../structures/BaseCommand';
import { BaseEvent } from '../structures/BaseEvent';
import { Commands } from './Commands';
import { Events } from './Events';

/*
|--------------------------------------------------------------------------
| Core: Register
|--------------------------------------------------------------------------
|
| ...
|
*/

const defaultConfig: RegisterDefaultConfig = {
  command: {
    allowDynamicAliases: false,
    middlewares: [],
    names: [],
  },
};

export class Register {
  /**
   * Callback function to group commands
   * @param params RegisterGroupParams
   * @param callback (params: RegisterGroupParams) => void
   */
  public static group(
    params: RegisterGroupParams,
    callback: (params: RegisterGroupParams) => void
  ): void {
    if (!isFunction(callback)) {
      throw new Error('Param {callback} expected to be a function');
    }

    callback(params);
  }

  /**
   * Register new command
   * @param path string Command path
   * @param newConfig CommandConfig
   */
  public static command(path: string, newConfig: CommandConfig = defaultConfig.command): void {
    if (!isString(path) || isEmpty(path)) {
      throw new Error('Property {path} is not a valid string format');
    }

    if (isEmpty(newConfig.names)) {
      throw new Error('Property {config.names} is required');
    }

    const config: CommandConfig = {
      ...defaultConfig.command,
      ...newConfig,
    };

    config.names.forEach((alias: string): void => {
      if (Commands.has(alias)) {
        throw new Error(`The alias {${alias}} has already been registered`);
      }

      try {
        const moduleImported: any = require(path).default;

        if (moduleImported?.prototype instanceof BaseCommand) {
          const command: any = moduleImported;
          const name: string = command.name;

          Commands.add(alias, {
            command,
            config,
            name,
            path,
          });
        }
      } catch (error) {
        //
      }
    });
  }

  /**
   * Register new event
   * @param name name Event name.
   * @param path string Event path
   * @url https://discord.js.org/#/docs/main/stable/class/Client
   */
  public static event(name: string, path: string): void {
    if (!isString(name) || isEmpty(name)) {
      throw new Error('Property {name} is required');
    }

    if (!isString(path) || isEmpty(path)) {
      throw new Error('Property {path} is required');
    }

    if (Events.has(name)) {
      throw new Error(`The event {${name}} has already been registered`);
    }

    try {
      const moduleImported: any = require(path).default;

      if (moduleImported?.prototype instanceof BaseEvent) {
        const event: any = moduleImported;

        Events.add(name, {
          event,
          name,
          path,
        });
      }
    } catch (error) {
      //
    }
  }
}
