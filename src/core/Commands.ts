
import { Collection } from 'discord.js';
import { isEmpty } from 'lodash';

import {
  CommandsCollection,
  CommandData,
  CommandDynamicInfo,
} from '../interfaces/structures/Command';

/*
|--------------------------------------------------------------------------
| Core: Commands
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Commands {
  /**
   * List of commands stored by aliases
   */
  private static readonly list: CommandsCollection = new Collection();

  /**
   * List of commands stored by classes
   */
  private static readonly raw: CommandsCollection = new Collection();

  /**
   * Add command to list
   * @param key string
   * @param value CommandData
   */
  public static add(key: string, value: CommandData): void {
    Commands.list.set(key, value);

    if (!Commands.raw.has(value.path)) {
      Commands.raw.set(value.path, value);
    }
  }

  /**
   * Retrieve command list
   * @return Array<CommandData>
   */
  public static all(): Array<CommandData> {
    return Commands.list.array();
  }

  /**
   * If it exists, retrieve the information from a command
   * @param key string
   * @return CommandData | undefined
   */
  public static get(key: string): CommandData | undefined {
    return Commands.list.get(key);
  }

  /**
   * Retrieve command list (classes version)
   * @return Array<CommandData>
   */
  public static rawList(): Array<CommandData> {
    return Commands.raw.array();
  }

  /**
   * Check if a command has been registered
   * @param key string
   * @return boolean
   */
  public static has(key: string): boolean {
    return Commands.list.has(key);
  }

  /**
   * Check if this command has a dynamic alias
   * @param command string
   * @return CommandDynamicInfo
   */
  public static hasDynamicAliases(command: string): CommandDynamicInfo {
    const commandsWithDynamicAliases: Array<CommandData> = (
      Commands.raw
        .filter(({ config: { allowDynamicAliases } }: CommandData): boolean => !!allowDynamicAliases)
        .array()
    );

    if (isEmpty(commandsWithDynamicAliases)) {
      return {
        validation: true,
      };
    }

    const total: number = commandsWithDynamicAliases.length;

    for (let a = 0; a < total; a++) {
      const { config: { names } }: CommandData = commandsWithDynamicAliases[a];
      const valitations: Array<boolean> = names.map((alias: string): boolean => command.startsWith(`${alias}:`));

      if (valitations.includes(true)) {
        return {
          commandData: commandsWithDynamicAliases[a],
          validation: true,
        };
      }
    }

    return {
      validation: false,
    };
  }
}
