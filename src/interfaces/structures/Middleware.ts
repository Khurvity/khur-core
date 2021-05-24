
import { Message } from 'discord.js';

import { CommandData } from '../../interfaces/structures/Command';

/*
|--------------------------------------------------------------------------
| Interfaces: Structure/Middleware
|--------------------------------------------------------------------------
|
| ...
|
*/

export interface MiddlewareParams {
  message: Message;
  commandData: CommandData;
}

export interface MiddlewareStructure {
  handle(params: MiddlewareParams): Promise<boolean>;
}
