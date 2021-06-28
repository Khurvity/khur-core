import { Client, Guild, Message, User } from 'discord.js';
import { isEmpty } from 'lodash';

import { RequestMentions, RequestParams, RequestValidations } from '../interfaces/core/Request';
import { IterableRegExpMatchArray } from '../interfaces/utils/Iterables';

import { Bot } from '../core/Bot';

import { iterate } from '../utils/functions';

/*
|--------------------------------------------------------------------------
| Util: Information
|--------------------------------------------------------------------------
|
| ...
|
*/

/**
 * Check for mentions
 * @param content string Message content
 * @return RequestValidations
 */
export function checkMentions(content: string): RequestValidations {
  return {
    startsWith: {
      channelMention: /^<#[0-9]+>/g.test(content),
      id: /^[0-9]+$/g.test(content),
      memberMention: /^<@!?[0-9]+>/g.test(content),
      roleMention: /^<@&[0-9]+>/g.test(content),
    },
  };
}

/**
 * Extract mentions from message content
 * @param content string
 * @return RequestMentions
 */
export function extractMentions(content: string): RequestMentions {
  const mentions: RequestMentions = {
    channels: [],
    emotes: [],
    roles: [],
    users: [],
  };

  if (isEmpty(content)) {
    return mentions;
  }

  const iterableChannels: IterableRegExpMatchArray = content.matchAll(/<#([0-9]+)>/g);
  const iterableEmotes: IterableRegExpMatchArray = content.matchAll(/<(a)?:([\w\d]+):([0-9]+)>/g);
  const iterableRoles: IterableRegExpMatchArray = content.matchAll(/<@&([0-9]+)>/g);
  const iterableUsers: IterableRegExpMatchArray = content.matchAll(/<@!?([0-9]+)>/g);

  iterate(iterableChannels, (item: RegExpMatchArray): void => {
    mentions.channels.push(item[1]);
  });

  iterate(iterableEmotes, (item: RegExpMatchArray): void => {
    mentions.emotes.push({
      id: item[3],
      name: item[2],
      animated: !isEmpty(item[1]),
      raw: item[0],
    });
  });

  iterate(iterableRoles, (item: RegExpMatchArray): void => {
    mentions.roles.push(item[1]);
  });

  iterate(iterableUsers, (item: RegExpMatchArray): void => {
    mentions.users.push(item[1]);
  });

  return mentions;
}

/**
 * Extract params from message content
 * @param content string
 * @return RequestParams
 */
export function extractParams(content: string): RequestParams {
  const data: RequestParams = {};
  const filters: IterableRegExpMatchArray = content.matchAll(
    /--([a-z:-]+)([\s\S]*?)(?=--[a-z:-]+|$)/g
  );

  iterate(filters, (item: RegExpMatchArray): void => {
    const key: string = item[1];
    const value: string = item[2];

    if (/^[a-z]+/g.test(key) && /[a-z0-9]+$/g.test(key)) {
      const newValue: string = value.trim();

      if (isEmpty(data[key])) {
        data[key] = {
          content: newValue,
          chunks: !isEmpty(newValue) ? [newValue] : [],
          mentions: {} as any,
        };
      } else {
        const condition: boolean = !isEmpty(newValue);

        if (condition) {
          data[key].content = `${data[key].content} ${newValue}`;
          data[key].chunks = [...data[key].chunks, newValue];
        }
      }
    }
  });

  if (!isEmpty(data)) {
    const keys: Array<string> = Object.keys(data);

    for (let a = 0, lena = keys.length; a < lena; a++) {
      const key = keys[a];

      data[key].mentions = extractMentions(data[key].content);
    }
  }

  return data;
}

/**
 * Getting user avatar
 * @param request Message | User
 * @return string
 */
export function getAuthorAvatar(request: Message | User): string {
  let author: User | undefined;
  let avatar: string = '';

  if (request instanceof Message) {
    author = request.author;
  } else if (request instanceof User) {
    author = request;
  }

  if (!isEmpty(author)) {
    avatar =
      author?.displayAvatarURL({ dynamic: true, size: 512 }) || author?.defaultAvatarURL || '';
  }

  return avatar;
}

/**
 * Getting Bot avatar
 * @return string
 */
export function getBotAvatar(): string {
  const { user }: Client = Bot.getClient();
  let avatar: string = '';

  if (!isEmpty(user)) {
    avatar = user?.displayAvatarURL({ dynamic: true, size: 512 }) || user?.defaultAvatarURL || '';
  }

  return avatar;
}

/**
 * Getting guild banner
 * @param message Guild | Message
 * @return string
 */
export function getGuildBanner(request: Guild | Message): string {
  let guild: Guild | null = null;

  if (request instanceof Message) {
    guild = request.guild;
  } else if (request instanceof Guild) {
    guild = request;
  }

  return guild?.bannerURL({ size: 2048 }) || '';
}

/**
 * Getting guild icon
 * @param message Guild | Message
 * @return string
 */
export function getGuildIcon(request: Guild | Message): string {
  let guild: Guild | null = null;

  if (request instanceof Message) {
    guild = request.guild;
  } else if (request instanceof Guild) {
    guild = request;
  }

  return guild?.iconURL({ dynamic: true, size: 512 }) || '';
}
