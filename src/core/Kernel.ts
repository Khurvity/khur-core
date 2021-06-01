import { EventData } from '../interfaces/structures/Event';

import { Events } from './Events';

/*
|--------------------------------------------------------------------------
| Core: Kernel
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Kernel {
  /**
   * Initialize registered events
   * @return Promise<void>
   */
  protected static async initializeEvents(): Promise<void> {
    const events: Array<EventData> = Events.all();

    events.forEach((item: EventData): void => {
      try {
        new (item.event as any)(item.name);
      } catch (error) {
        console.error(`Event {${item.name}} cannot be initialized | Error:`, error);
      }
    });
  }
}
