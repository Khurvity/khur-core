import { MiddlewareParams, MiddlewareStructure } from '../interfaces/structures/Middleware';

/*
|--------------------------------------------------------------------------
| Structure: BaseMiddleware
|--------------------------------------------------------------------------
|
| ...
|
*/

export class BaseMiddleware implements MiddlewareStructure {
  /**
   * Execute middleware
   * @return Promise<void>
   */
  public async handle(params: MiddlewareParams): Promise<boolean> {
    throw new Error(`BaseMiddleware -> handle() method is not defined${'...' || [params]}`);
  }
}
