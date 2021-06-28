import { RequestMentions, RequestParams } from '../../src/interfaces/core/Request';

import { checkMentions, extractMentions, extractParams } from '../../src/utils/info';

/*
|--------------------------------------------------------------------------
| ...
|--------------------------------------------------------------------------
*/

describe('Check Mentions', () => {
  it('It does not start with the mention of the channel', () => {
    const content: string = 'Sample channel: <#123456789123456789>';
    const result: boolean = checkMentions(content).startsWith.channelMention;

    expect(result).toEqual(false);
  });

  it('It does start with the mention of the channel', () => {
    const content: string = '<#123456789123456789> <- Channel';
    const result: boolean = checkMentions(content).startsWith.channelMention;

    expect(result).toEqual(true);
  });

  it('It does start with the mention of a member', () => {
    const content: Array<string> = [
      '<@!123456789123456789> <- Member',
      '<@123456789123456789> <- Member',
    ];
    const result: Array<boolean> = [
      checkMentions(content[0]).startsWith.memberMention,
      checkMentions(content[0]).startsWith.memberMention,
    ];

    expect(result).toEqual([true, true]);
  });
});

/*
|--------------------------------------------------------------------------
| ...
|--------------------------------------------------------------------------
*/

describe('Extract Mentions', () => {
  it('Extract channels', () => {
    const content: string = 'Sample text <#123456789123456789> more text <#123456789123456789>';
    const result: RequestMentions = extractMentions(content);

    expect(result.channels.length).toEqual(2);
  });

  it('Extract emotes', () => {
    const content: string =
      'Sample text <:emote1:123456789123456789> more text <:emote2:123456789123456789>';
    const result: RequestMentions = extractMentions(content);

    expect(result.emotes.length).toEqual(2);
  });

  it('Extract roles', () => {
    const content: string = 'Sample text <@&123456789123456789> more text <@&123456789123456789>';
    const result: RequestMentions = extractMentions(content);

    expect(result.roles.length).toEqual(2);
  });

  it('Extract users', () => {
    const content: string = 'Sample text <@!123456789123456789> more text <@123456789123456789>';
    const result: RequestMentions = extractMentions(content);

    expect(result.users.length).toEqual(2);
  });
});

/*
|--------------------------------------------------------------------------
| ...
|--------------------------------------------------------------------------
*/

describe('Extract Params', () => {
  it('Extract 3 params', () => {
    const content: string = 'Test message --param test --non --key value';
    const result: RequestParams = extractParams(content);

    expect(Object.keys(result).length).toEqual(3);
  });

  it('Join repeating parameter values', () => {
    const content: string = 'Test message --param 1 --non --param 2 --key value';
    const result: RequestParams = extractParams(content);

    expect(result.param?.content).toEqual('1 2');
  });

  it("Shouldn't find parameter: lastname", () => {
    const content: string = '--name John --key value';
    const result: RequestParams = extractParams(content);

    expect(result.lastname?.content).toEqual(undefined);
  });

  it('Extract mentions in params: Channels', () => {
    const content: Array<string> = [
      '--list John <#123456789123456789>--key',
      '--list John <#123456789123456789> --key <#!123456789123456789> <#> <#123456789>',
    ];
    const result: Array<number> = [
      extractParams(content[0]).list?.mentions.channels.length,
      extractParams(content[0]).key?.mentions.channels.length,
      extractParams(content[0]).nothing?.mentions.channels.length,

      extractParams(content[1]).list.mentions.channels.length,
      extractParams(content[1]).key.mentions.channels.length,
    ];

    expect(result).toEqual([1, 0, undefined, 1, 1]);
  });

  it('Extract mentions in params: Emotes', () => {
    const content: Array<string> = [
      '--list John <:sample:123456789123456789>--key',
      '--list John <A:sample2:123456789123456789> --key <::123456789123456789> text <a:none:123456789>',
    ];
    const result: Array<number> = [
      extractParams(content[0]).list?.mentions.emotes.length,
      extractParams(content[0]).nothing?.mentions.emotes.length,
      extractParams(content[0]).key?.mentions.emotes.length,

      extractParams(content[1]).list.mentions.emotes.length,
      extractParams(content[1]).key.mentions.emotes.length,
    ];

    expect(result).toEqual([1, undefined, 0, 0, 1]);
  });

  it('Extract mentions in params: Roles', () => {
    const content: Array<string> = [
      '--list John <@&123456789>--key',
      '--list John <@&> --key <@&123456789123456789> text <@&123456789>',
    ];
    const result: Array<number> = [
      extractParams(content[0]).list?.mentions.roles.length,
      extractParams(content[0]).key?.mentions.roles.length,

      extractParams(content[1]).list.mentions.roles.length,
      extractParams(content[1]).key.mentions.roles.length,
    ];

    expect(result).toEqual([1, 0, 0, 2]);
  });

  it('Extract mentions in params: Users', () => {
    const content: Array<string> = [
      '--list John <@123456789123456789>--key',
      '--list John <@123456789123456789> --key <@!123456789123456789> <@> <@!123456789>',
    ];
    const result: Array<number> = [
      extractParams(content[0]).list?.mentions.users.length,
      extractParams(content[0]).key?.mentions.users.length,
      extractParams(content[0]).nothing?.mentions.users.length,

      extractParams(content[1]).list.mentions.users.length,
      extractParams(content[1]).key.mentions.users.length,
    ];

    expect(result).toEqual([1, 0, undefined, 1, 2]);
  });
});
