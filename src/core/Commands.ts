
import { Collection } from 'discord.js';

import { CommandsCollection, CommandData } from '../interfaces/structures/Command';

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
}
