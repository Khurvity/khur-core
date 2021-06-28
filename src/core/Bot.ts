import { Client } from 'discord.js';

/*
|--------------------------------------------------------------------------
| Core: Bot
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Bot {
  /**
   * Bot status. If it is false, the bot will not be able to respond to user commands except users with administrator permissions.
   */
  private static status: boolean = true;

  /**
   * Client instance
   * @url https://discord.js.org/#/docs/main/stable/class/Client
   */
  private static client: Client;

  /**
   * Bot prefix
   */
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Getting bot status
   * @return boolean
   */
  public static getStatus(): boolean {
    return Bot.status;
  }

  /**
   * Change bot status
   * @param status boolean
   */
  public static setStatus(status: boolean): void {
    Bot.status = status;
  }

  /**
   * Getting client instance
   * @return Client
   */
  public static getClient(): Client {
    return Bot.client;
  }

  /**
   * Set client instance
   * @param client Client
   */
  public static setClient(client: Client): void {
    Bot.client = client;
  }

  /**
   * Getting bot prefix
   * @return string
   */
  public getPrefix(): string {
    return this.prefix;
  }
}
