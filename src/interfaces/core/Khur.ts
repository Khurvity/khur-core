
import { Client } from 'discord.js';

/*
|--------------------------------------------------------------------------
| Interfaces: Core/Khur
|--------------------------------------------------------------------------
|
| ...
|
*/

export type BotScopeOptions = 'bot';

export interface BotCredentials {
  client: {
    id: string;
    secret: string;
  };
  token: string;
  scopes: Array<BotScopeOptions>;
  permissions: string;
}

export interface KhurConfig {
  appRoot: string;
  bot: BotCredentials;
  defaultPrefix: string;
  discordClient: Client;
  onReady?(client: Client): Promise<void>;
}
