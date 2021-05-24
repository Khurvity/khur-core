
import { BaseMiddleware } from '../../structures/BaseMiddleware';

/*
|--------------------------------------------------------------------------
| Interfaces: Handler/Command
|--------------------------------------------------------------------------
|
| ...
|
*/

export interface CommandHandlerConfig {
  middlewares?: Array<typeof BaseMiddleware>;
  prefix: string;
}
