
import { isFunction } from 'lodash';

/*
|--------------------------------------------------------------------------
| Util: Functions
|--------------------------------------------------------------------------
|
| ...
|
*/

/**
 * Iterate on results of type: IterableIterator<RegExpMatchArray>
 * @param iterable IterableIterator<RegExpMatchArray>
 * @param callback (item: RegExpMatchArray) => void
 */
export function iterate(
  iterable: IterableIterator<RegExpMatchArray>,
  callback: (item: RegExpMatchArray) => void,
): void {
  if (!isFunction(callback)) {
    return;
  }

  let currentIterator: IteratorResult<RegExpMatchArray, any>;

  do {
    currentIterator = iterable.next();

    if (!currentIterator.done) {
      callback(currentIterator.value);
    }
  } while (!currentIterator.done);
}
