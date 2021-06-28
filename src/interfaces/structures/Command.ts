import {
  Collection,
  Message,
  // PermissionResolvable,
} from 'discord.js';

import { Bot } from '../../core/Bot';
import { Request } from '../../core/Request';
import { Translation } from '../../core/Translation';

import { BaseCommand } from '../../structures/BaseCommand';
import { BaseMiddleware } from '../../structures/BaseMiddleware';

/*
|--------------------------------------------------------------------------
| Interfaces: Structure/Command
|--------------------------------------------------------------------------
|
| ...
|
*/

export type CommandsCollection = Collection<string, CommandData>;

export interface CommandConfig {
  allowDynamicAliases?: boolean;
  middlewares?: Array<typeof BaseMiddleware>;
  names: Array<string>;
  [key: string]: any;
}

export interface CommandConstructorParams {
  bot: Bot;
  config: CommandConfig;
  message: Message;
  request: Request;
  translation: Translation;
}

export interface CommandData {
  command: BaseCommand;
  config: CommandConfig;
  name: string;
  path: string;
}

export interface CommandDynamicInfo {
  commandData?: CommandData;
  validation: boolean;
}

export interface CommandStructure {
  handle(): Promise<void>;
}
