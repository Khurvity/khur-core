
import { Collection, PermissionResolvable } from 'discord.js';

import { BaseCommand } from '../../structures/BaseCommand';

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
  category: string;
  cooldown: number;
  locked: boolean;
  middlewares: Array<string>;
  names: Array<string>;
  nsfw: {
    current: boolean;
  };
  onlyDevs: boolean;
  permissions: PermissionResolvable;
  strictPerms: boolean;
}

export interface CommandData {
  command: BaseCommand;
  config: CommandConfig;
  name: string;
  path: string;
}

export interface CommandStructure {
  handle(): Promise<void>;
}
