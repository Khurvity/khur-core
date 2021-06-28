import { isBoolean, isEmpty } from 'lodash';

import { MiddlewareHandlerParams } from '../interfaces/handlers/Middleware';

import { BaseMiddleware } from '../structures/BaseMiddleware';

/*
|--------------------------------------------------------------------------
| Handler: Middlewares
|--------------------------------------------------------------------------
|
| ...
|
*/

export class MiddlewareHandler {
  /**
   * Check all middlewares
   * @param params MiddlewareHandlerParams
   * @return Promise<boolean>
   */
  public static async check({
    message,
    commandData,
    middlewares,
  }: MiddlewareHandlerParams): Promise<boolean> {
    if (isEmpty(middlewares)) {
      return true;
    }

    for (const middleware of middlewares) {
      if (!(middleware?.prototype instanceof BaseMiddleware)) {
        throw new Error(
          `Middleware {${middleware?.name}} expected to be extended from BaseMiddleware class`
        );
      }

      const currentMiddleware: BaseMiddleware = new middleware();
      const response: boolean = await currentMiddleware.handle({ message, commandData });

      if (!isBoolean(response) || !response) {
        return false;
      }
    }

    return true;
  }
}
