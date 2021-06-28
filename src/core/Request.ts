import { Message } from 'discord.js';
import { isEmpty, isNull, isString } from 'lodash';

import { RequestData } from '../interfaces/core/Request';

import { Bot } from './Bot';

import { extractMentions, extractParams } from '../utils/info';
import { trim } from '../utils/validations';

/*
|--------------------------------------------------------------------------
| Core: Request
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Request {
  /**
   * Instance: Bot
   */
  private bot: Bot;

  /**
   * Discord message
   */
  private message: Message;

  /**
   * Current prefix
   */
  private prefix: string;

  constructor(bot: Bot, message: Message) {
    this.bot = bot;
    this.message = message;
    this.prefix = this.bot.getPrefix();
  }

  /**
   * Extract and parse message content
   * @param message string
   * @return RequestData
   */
  public data(message?: string): RequestData {
    const currentContent: string = isEmpty(message)
      ? this.message.content
      : isString(message)
      ? message
      : '';
    let content: string = currentContent
      .replace(/>/g, '> ')
      .trim()
      .replace(/(--[a-z:-]+)/g, '$1 ');
    let chunks: Array<string> = content
      .split(' ')
      .filter((chunk: string): boolean => !isEmpty(chunk));
    let command: string = '';
    let newContent: string = '';

    if (Request.isCommand(this.prefix, content)) {
      command = (chunks[0] || '').toLowerCase().replace(this.prefix, '');
      chunks = chunks.slice(1);
    }

    const rawContent: string = chunks.join(' ');
    const parseContent: RegExpExecArray | null = /^[\s\S]*?(?=--[a-z:-]+|$)/g.exec(rawContent);

    if (!isNull(parseContent)) {
      newContent = parseContent[0].trim();
    }

    return {
      prefix: this.prefix,
      command,
      content: newContent,
      chunks: chunks
        .map((chunk: string): string => chunk.trim())
        .filter((chunk: string): boolean => !isEmpty(chunk)),
      mentions: extractMentions(rawContent),
      params: extractParams(rawContent),
      raw: {
        content: content.trim(),
      },
    };
  }

  /**
   * Verify that it is a possible command
   * @param prefix string
   * @param message string
   * @return boolean
   */
  public static isCommand(prefix: string, message: string): boolean {
    const content: string = trim(message);
    const validation: boolean = content.toLowerCase().startsWith(prefix);

    return validation;
  }
}
