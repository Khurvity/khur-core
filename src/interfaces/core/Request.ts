/*
|--------------------------------------------------------------------------
| Interfaces: Core/Request
|--------------------------------------------------------------------------
|
| ...
|
*/

export interface RequestData {
  prefix: string;
  command: string;
  content: string;
  chunks: Array<string>;
  mentions: RequestMentions;
  params: RequestParams;
  raw: {
    content: string;
  };
}

export interface RequestMentions {
  channels: Array<string>;
  emotes: Array<RequestMentionsEmote>;
  roles: Array<string>;
  users: Array<string>;
}

export interface RequestMentionsEmote {
  id: string;
  animated: boolean;
  name: string;
  raw: string;
}

export interface RequestParams {
  [key: string]: RequestParamsData;
}

export interface RequestParamsData {
  content: string;
  chunks: Array<string>;
  mentions: RequestMentions;
}

export interface RequestValidations {
  startsWith: {
    channelMention: boolean;
    id: boolean;
    memberMention: boolean;
    roleMention: boolean;
  };
}
