
import { Collection } from 'discord.js';

import { EventsCollection, EventData } from '../interfaces/structures/Event';

/*
|--------------------------------------------------------------------------
| Core: Events
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Events {
  /**
   * List of events
   */
  private static readonly list: EventsCollection = new Collection();

  /**
   * Add event to list
   * @param key string
   * @param value EventData
   */
  public static add(key: string, value: EventData): void {
    Events.list.set(key, value);
  }

  /**
   * Retrieve event list
   * @return Array<EventData>
   */
  public static all(): Array<EventData> {
    return Events.list.array();
  }

  /**
   * If it exists, retrieve the information from a event
   * @param key string
   * @return EventData | undefined
   */
  public static get(key: string): EventData | undefined {
    return Events.list.get(key);
  }

  /**
   * Check if a event has been registered
   * @param key string
   * @return boolean
   */
  public static has(key: string): boolean {
    return Events.list.has(key);
  }
}
