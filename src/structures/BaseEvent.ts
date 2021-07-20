import { Client } from 'discord.js';

import { EventStructure } from '../interfaces/structures/Event';

import { Bot } from '../core/Bot';

/*
|--------------------------------------------------------------------------
| Structure: BaseEvent
|--------------------------------------------------------------------------
|
| ...
|
*/

export class BaseEvent implements EventStructure {
  constructor(name: string) {
    const client: Client = Bot.getClient();

    try {
      client.on(name, this.handle);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Execute event
   * @return Promise<void>
   */
  protected async handle(..._: Array<any>): Promise<void> {
    throw new Error('BaseEvent -> handle() method is not defined');
  }
}
