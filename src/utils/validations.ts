/*
|--------------------------------------------------------------------------
| Util: Validations
|--------------------------------------------------------------------------
|
| ...
|
*/

/**
 * Clear extra spaces in text
 * @param text string
 * @return string
 */
export function trim(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Clear extra spaces in text | Multi lines
 * @param text string
 * @return string
 */
export function trimLines(text: string): string {
  return text.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');
}
