
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
  currentTranslation?: string;
  middlewares?: Array<typeof BaseMiddleware>;
  prefix: string;
}
