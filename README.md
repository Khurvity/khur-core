![GitHub release (latest by date)](https://img.shields.io/github/v/release/Khurvity/khur-core?label=Release) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Khurvity/khur-core/Deployment?label=Deployment) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Khurvity/khur-core/Testing?label=Tests) ![GitHub](https://img.shields.io/github/license/Khurvity/khur-core?label=License)

# Khur Core

Set of base tools to work with the [discord.js](https://github.com/discordjs/discord.js) library.

This library contains some features to facilitate the event log and commands, besides using middlewares for the command handler (including the individual commands) to provide a better extension of functionality.

**Note**: As of **`version >= 0.2.0`** it will not include the Discord.js package so it must be installed in your project separately.

## Features

- Command handler
- Event handler
- Translations by command or global
- Custom middlewares
- Support to:
  - Multi prefix
  - Command aliases (and dynamic alias)
- Custom project structure
- Simple command structure
- TypeScript support

## Installation

Node.js 14 or newer is required.

```bash
yarn add @khurvity/khur-core
```

## Getting Started

At the moment of registering events, commands or any other feature, it is required to be done before configuring the library (`Khur.config(...)`).

### Configuration

The `Client` class forms part of the library [discord.js](https://github.com/discordjs/discord.js).

```typescript
import { Khur, Client } from '@khurvity/khur-core';

Khur.config({
  appRoot: __dirname,
  defaultPrefix: '!',
  i18n: {
    supported: ['es', 'en'],
    globalTranslationsPath: 'PATH_TO_TRANSLATIONS_FOLDER',
  },
  bot: {
    client: {
      id: 'EXAMPLE_ID',
      secret: 'EXAMPLE_SECRET',
    },
    token: 'EXAMPLE_TOKEN',
    scopes: ['bot'],
    permissions: '8',
  },
  discordClient: new Client(), // Discord Client
});
```

The parameters that the `Khur.config` method receives are:

```typescript
Khur.config(<KhurConfig>);

interface KhurConfig {
  appRoot: string;
  bot: BotCredentials;
  defaultPrefix: string;
  discordClient: Client;
  i18n: {
    globalTranslationsPath: string;
    supported: Array<string>;
  };
  onReady?(client: Client): Promise<void>;
}

interface BotCredentials {
  client: {
    id: string;
    secret: string;
  };
  token: string;
  scopes: Array<BotScopeOptions>; // type ['bot']
  permissions: string;
}
```

### Register event

The event's name must be one available from the following [documentation](https://discord.js.org/#/docs/main/stable/class/Client) shown in the `Client` class.

```typescript
Register.event(<event>, 'PATH_TO_EVENT_FILE');
```

### Register command

The `category` and `names` properties are required.

```typescript
Register.command('PATH_TO_COMMAND_FOLDER', {
  category: 'Test',
  names: ['test', 'alias1', 'alias2'],
});
```

The criteria received for the the method `Register.command` are the following:

```typescript
Register.command(<string>, <CommandConfig>);

interface CommandConfig {
  allowDynamicAliases?: boolean;
  middlewares?: Array<typeof BaseMiddleware>;
  names: Array<string>;
  [key: string]: any;
}
```

## Example usage

Keep in mind the following structure of files:

    .
    ├── src
    │   ├── app
    │   │   ├── commands
    │   │   │   └── Sample
    │   │   │       └── index.ts <── Command
    │   │   └── events
    │   │       └── Message.ts <── EventMessage
    │   └── index.ts <── MainFile
    └──README.md

Configuration for `./src/app/events/Message.ts`:

```typescript
import {
  BaseEvent,
  CommandHandler,
  Khur,
  Message as MessageData,
} from '@khurvity/khur-core';

export default class Message extends BaseEvent {
  protected async handle(message: MessageData): Promise<void> {
    try {
      await CommandHandler.init(message, {
        prefix: Khur.getDefaultPrefix(),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
```

Configuration for `./src/app/commands/Sample/index.ts`:

```typescript
import { BaseCommand } from '@khurvity/khur-core';

export default class Sample extends BaseCommand {
  public async handle(): Promise<void> {
    // this.deleteCommandUse(); // uncomment to remove usage of the command
    this.message.channel.send('Sample!');
  }
}
```

**Note**: An alias will be used for the importation of files.

Configuration for `./src/index.ts`:

```typescript
import { Register, Khur, Client } from '@khurvity/khur-core';

Register.event('message', '@app-event/Message');

Register.command('@app-command/Sample', {
  category: 'Test',
  names: ['sample', 'alias1', 'alias2'],
});

// It is recommended to use this method if you want to run some features before starting the Bot
Khur.beforeInit(async (): Promise<void> => {
  console.log('Hi!');
});

Khur.config({
  appRoot: __dirname,
  defaultPrefix: '!',
  i18n: {
    supported: ['es', 'en'],
    globalTranslationsPath: '@app-translation',
  },
  bot: {
    client: {
      id: 'EXAMPLE_ID',
      secret: 'EXAMPLE_SECRET',
    },
    token: 'EXAMPLE_TOKEN',
    scopes: ['bot'],
    permissions: '8', // Administrator
  },
  discordClient: new Client(),
});
```

To execute this code and test on your Discord server, the command `!sample` should reply with a message saying `Sample!`

## Structure of classes

The classes for `@khurvity/khur-core` contain utility properties and methods, which are shown below:

### Class: Bot

Property | Type | Description
--- | --- | ---
prefix | string | Bot prefix


Method | Return | Description
--- | --- | ---
getStatus() | boolean | **static** Getting bot status
setStatus(status: boolean) | void | **static** Change bot status
getClient() | Client | **static** Getting client instance
setClient([Client](https://discord.js.org/#/docs/main/stable/class/Client)) | void | **static** Set client instance
getPrefix() | string | Getting bot prefix

### Class: Commands

Method | Return | Description
--- | --- | ---
all() | Array<CommandData> | **static** Retrieve command list
get(key: string) | CommandData \| undefined | **static** If it exists, retrieve the information from a command
rawList() | Array<CommandData> | **static** Retrieve command list (classes version)
has(key: string) | boolean | **static** Check if a command has been registered

### Class: Events

Method | Return | Description
--- | --- | ---
all() | Array<EventData> | **static** Retrieve event list
get(key: string) | EventData \| undefined | **static** If it exists, retrieve the information from a event
has(key: string) | boolean | **static** Check if a event has been registered

### Class: Khur

Method | Return | Description
--- | --- | ---
config(data: KhurConfig) | Promise<void> | **static** Initialize all application configuration
getAppRoot() | string | **static** Getting application path
getDefaultPrefix() | string | **static** Getting default prefix
beforeInit(initCallback: () => Promise<void>) | Promise<void> | **static** Set initialize function

### Class: Register

Method | Return | Description
--- | --- | ---
group(params: RegisterGroupParams, callback: (params: RegisterGroupParams) => void) | void | **static** Callback function to group commands
command(path: string, newConfig: CommandConfig) | void | **static** Register new command
event(name: string, path: string) | void | **static** Register new event. [More details](https://discord.js.org/#/docs/main/stable/class/Client)

### Class: Request

Property | Type | Description
--- | --- | ---
bot | Bot | Instance: Bot
message | [Message](https://discord.js.org/#/docs/main/stable/class/Message) | Discord message
prefix | string | Current prefix

Method | Return | Description
--- | --- | ---
data(message?: string) | RequestData | Extract and parse message content
isCommand(prefix: string, message: string) | boolean | **static** Verify that it is a possible command

### Class: Translation

```typescript
const translation = new Translation(current: null | string = null, commandPath?: string);

// translation.globals('<filename>.<property>.<property>', { name: 'John' });
translation.globals('info.author', { name: 'John' });

// PATH_TO/info.ts
export const author = 'Hello! My name is {{name}}';
```

Property | Type | Description
--- | --- | ---
current | string | Current translation language

Method | Return | Description
--- | --- | ---
getSupported() | Array<string> | **static** Getting list of supported languages
setSupported(supported: Array<string>) | void | **static** Set list of supported languages
getCurrent() | string | Getting current language
globals(key: string, replace: TranslationReplaceParams = {}) | any | Use globals translations
locals(key: string, replace: TranslationReplaceParams = {}) | any | Use locals translations
checkLocaleFormat(locale: string) | boolean | **static** Check if language key to use has a valid format

### Class: CommandHandler

Method | Return | Description
--- | --- | ---
init(message: [Message](https://discord.js.org/#/docs/main/stable/class/Message), config?: CommandHandlerConfig) | Promise<void> | **static** Initialize handler

## Structure of features (utilities)

```typescript
import {
  checkMentions,
  extractMentions,
  extractParams,
  getAuthorAvatar,
  getBotAvatar,
  getGuildBanner,
  getGuildIcon,
} from '@khurvity/khur-core';
```

Function | Return | Description
--- | --- | ---
checkMentions(content: string) | RequestValidations | Check for mentions
extractMentions(content: string) | RequestMentions | Extract mentions from message content
extractParams(content: string) | RequestParams | Extract params from message content
getAuthorAvatar(request: [Message](https://discord.js.org/#/docs/main/stable/class/Message) \| [User](https://discord.js.org/#/docs/main/stable/class/User)) | string | Getting user avatar
getBotAvatar() | string | Getting Bot avatar
getGuildBanner(request: [Guild](https://discord.js.org/#/docs/main/stable/class/Guild) \| [Message](https://discord.js.org/#/docs/main/stable/class/Message)) | string | Getting guild banner
getGuildIcon(request: [Guild](https://discord.js.org/#/docs/main/stable/class/Guild) \| [Message](https://discord.js.org/#/docs/main/stable/class/Message)) | string | Getting guild icon

## API Reference

- In the main file, the last thing to be running must be `Khur.config` due to it being in charge of starting the settings of the Bot.
- Middlewares `Array<Middleware>`: if the returned value is false, the command won't be executed.
- The commands/events will always be extended to its base class such as `BaseCommand` and `BaseEvent` respectively, in addition to being exported by default `export default class ...`.

### `Khur.beforeInit`

Do execute each feature before starting the Bot. This must be run before `Khur.config(...)`

```typescript
Khur.beforeInit(async (): Promise<void> => {
  console.log('{beforeInit} -> Hi!');
})
```

### `Khur.config`

Register each setting to start the client and internal components:

```typescript
Khur.config(<KhurConfig>)
```

Interface: **KhurConfig**

Property | type | Description
--- | --- | ---
appRoot | string | Main directory of the project
bot | BotCredentials | Credentials of your application. See [Discord Developers](https://discord.com/developers/applications)
bot.client.id | string | Client ID
bot.client.secret | string | Client Secret
bot.token | string | Bot Token
defaultPrefix | string | Bot prefix
discordClient | Client | Client instance
i18n | | Translation config |
i18n.globalTranslationsPath | string | Path to global translations folder
i18n.supported | Array<string> | Languages supported
onReady?(client: Client) | Promise<void> | Callback. Bot is ready

### `Register.event`

To register an event. See the [documentation (Client)](https://discord.js.org/#/docs/main/stable/class/Client) to know about the list of available events.

```typescript
Register.event(<event>, 'PATH_TO_EVENT_FILE');
```

### `Register.group`

To group the record of commands.

```typescript
Register.group(<RegisterGroupParams>, callback: (params: RegisterGroupParams) => void);
```

Interface: **RegisterGroupParams**

Property | Type | Description
--- | --- | ---
prefix? | string | Prefix (any context)
[key: string] | any | Custom value

```typescript
Register.group({
  prefix: '@app-command/Information',
}, (params: RegisterGroupParams): void => {
  Register.command(`${params.prefix}/Help`, {
    category: 'Information',
    names: ['help', 'h'],
  });

  Register.command(`${params.prefix}/Support`, {
    category: 'Information',
    names: ['support'],
  });
});
```

### `Register.command`

Register command. The properties of these settings can be accessed through the middlewares (including the command) to add validations.

```typescript
Register.command('PATH_TO_COMMAND_FOLDER', <CommandConfig>);
```

Interface: **CommandConfig**

Property | Type | Description
--- | --- | ---
allowDynamicAliases? | boolean | Allow dynamic alias
middlewares? | Array<typeof BaseMiddleware> | Middleware to use
names | Array<string> | **required** Aliases
[key: string] | any | Custom value

```typescript
// Using alias (directory)
Register.command('@app-command/Sample', {
  allowDynamicAliases: true,
  category: 'Test',
  cooldown: 5, // Seconds
  middlewares: [OnlyGuild], // Details below
  names: ['sample', 'non'], // Two aliases
  nsfw: {
    current: true, // This command has NSFW content
  },
});
```
**Note:** Dynamic aliases are detected with after the ":" or "-" character, for example: `name:dynamicalias`, `name:non`, `name-dynamicalias`, `name-non`, etc.

- If `allowDynamicAliases = true` the aliases should coincide with `sample:dynamic`, `sample:bye`, `non:sample`, `non:test`, `sample-dynamic`, `sample-bye`.
- Middleware `OnlyGuild` indicates that the command could be executed if it is in a server.

### `CommandHandler.init`

Use the command handler.

```typescript
await CommandHandler.init(<EventMessage>, <CommandHandlerConfig>);
```

Interface: **CommandHandlerConfig**

Property | Type | Description
--- | --- | ---
currentTranslation? | string | Key of current translation (es, en, es-ES, en-US, etc)
middlewares? | Array<BaseMiddleware> | Middlewares to evaluate before command
prefix | string | **required** Current prefix or custom by Guild

```typescript
try {
  await CommandHandler.init(message, {
    // currentTranslation: 'en', // Or dynamic (by database)
    prefix: Khur.getDefaultPrefix(), // Or dynamic (by database)
    // middlewares: [],
  });
} catch (error) {
  console.error(error);
}
```

## Credits

This project generate a build using [TSDX](https://tsdx.io/) a zero-config CLI for TypeScript package development.
