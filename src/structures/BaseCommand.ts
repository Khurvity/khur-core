
import { CommandStructure } from '../interfaces/structures/Command';

/*
|--------------------------------------------------------------------------
| Structure: BaseCommand
|--------------------------------------------------------------------------
|
| ...
|
*/

export class BaseCommand implements CommandStructure {
  /**
   * Execute command
   * @return Promise<void>
   */
  public async handle(): Promise<void> {
    throw new Error('BaseCommand -> handle() method is not defined');
  }
}
