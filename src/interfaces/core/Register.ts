import { CommandConfig } from '../structures/Command';

/*
|--------------------------------------------------------------------------
| Interfaces: Core/Server
|--------------------------------------------------------------------------
|
| ...
|
*/

export interface RegisterDefaultConfig {
  command: CommandConfig;
}

export interface RegisterGroupParams {
  prefix?: string;
  [key: string]: any;
}
