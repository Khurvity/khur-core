
import { Message } from 'discord.js';

import { CommandData } from '../../interfaces/structures/Command';

import { BaseMiddleware } from '../../structures/BaseMiddleware';

/*
|--------------------------------------------------------------------------
| Interfaces: Handler/Middleware
|--------------------------------------------------------------------------
|
| ...
|
*/

export interface MiddlewareHandlerParams {
  message: Message,
  commandData: CommandData,
  middlewares: Array<typeof BaseMiddleware>,
}
