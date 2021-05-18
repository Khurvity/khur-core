
import { Collection } from 'discord.js';

import { BaseEvent } from '../../structures/BaseEvent';

/*
|--------------------------------------------------------------------------
| Interfaces: Structure/Event
|--------------------------------------------------------------------------
|
| ...
|
*/

export type EventsCollection = Collection<string, EventData>;

export interface EventData {
  event: BaseEvent;
  name: string;
  path: string;
}

export interface EventStructure {
  //
}
