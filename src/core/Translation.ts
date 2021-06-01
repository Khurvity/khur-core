import lodash, {
  isArrayLike,
  isEmpty,
  isFunction,
  isNull,
  isObjectLike,
  isString,
  isUndefined,
} from 'lodash';

import { TranslationReplaceParams } from '../interfaces/core/Translation';

import { trim } from '../utils/validations';

/*
|--------------------------------------------------------------------------
| Core: Translation
|--------------------------------------------------------------------------
|
| ...
|
*/

export class Translation {
  /**
   * List of languages supported
   */
  private static supported: Array<string> = [];

  /**
   * Default translation language
   */
  private static defaultTranslation: string | undefined;

  /**
   * Directory path of global translations
   */
  private static globalPath: string;

  /**
   * Current translation language
   */
  private current: string;

  /**
   * Current command translations directory path
   * @param current     [description]
   * @param commandPath [description]
   */
  private commandPath: string;

  constructor(current: null | string = null, commandPath?: string) {
    Translation.checkValidations(current, commandPath);

    Translation.defaultTranslation = Translation.getSupported()[0];
    this.current = current || Translation.defaultTranslation;

    if (!isEmpty(commandPath)) {
      this.commandPath = `${commandPath}/translations`;
    } else {
      this.commandPath = '';
    }
  }

  /**
   * Getting list of supported languages
   * @return Array<string>
   */
  public static getSupported(): Array<string> {
    return Translation.supported;
  }

  /**
   * Set list of supported languages
   * @param supported Array<string>
   */
  public static setSupported(supported: Array<string>): void {
    if (!isEmpty(Translation.supported)) {
      return;
    }

    if (!isArrayLike(supported) || isEmpty(supported)) {
      throw new Error('Param {supported} expected to be an Array<string>');
    }

    const validation: boolean =
      supported.filter((locale: string): boolean =>
        isString(locale) ? Translation.checkLocaleFormat(locale) : false
      ).length === supported.length;

    if (!validation) {
      throw new Error(
        'Values for {supported} expected to be a string with format: en, en-US, es, es-MX, etc'
      );
    }

    Translation.supported = supported;
  }

  /**
   * Getting current language
   * @return string
   */
  public getCurrent(): string {
    return this.current;
  }

  /**
   * Use globals translations
   * @param key string
   * @param replace TranslationReplaceParams
   * @return any
   */
  public globals(key: string, replace: TranslationReplaceParams = {}): any {
    return this.getTranslations(Translation.globalPath, 'global', key, replace);
  }

  /**
   * Use locals translations
   * @param key string
   * @param replace TranslationReplaceParams
   * @return any
   */
  public locals(key: string, replace: TranslationReplaceParams = {}): any {
    return this.getTranslations(this.commandPath, 'local', key, replace);
  }

  /**
   * Check if language key to use has a valid format
   * @param locale string
   * @return boolean
   */
  public static checkLocaleFormat(locale: string): boolean {
    return /^[a-z]{2,}(-[a-z]{2,})?$/gi.test(locale);
  }

  /**
   * Getting global translations directory path
   * @return string
   */
  public static getGlobalPath(): string {
    return Translation.globalPath;
  }

  /**
   * Set global translations directory path
   * @param path string
   */
  public static setGlobalPath(path: string): void {
    if (!isEmpty(Translation.globalPath)) {
      return;
    }

    if (!isString(path) || isEmpty(path)) {
      throw new Error('Param {path} expected to be a valid string');
    }

    Translation.globalPath = path;
  }

  /**
   * Getting translations
   * @param basePath string
   * @param type 'global' | 'local'
   * @param key string
   * @param replace TranslationReplaceParams
   * @return any
   */
  private getTranslations(
    basePath: string,
    type: 'global' | 'local',
    key: string,
    replace: TranslationReplaceParams
  ): any {
    const use: string = trim(key);

    if (isEmpty(use)) {
      return `${type}._empty`;
    }

    const chunks: Array<string> = use.split('.');

    if (chunks.length <= 1) {
      return `${type}.${chunks[0]}._default`;
    }

    if (isEmpty(basePath)) {
      return `${type}.${chunks.join('.')}._empty`;
    }

    const accessKey: string = chunks.slice(1).join('.');
    let defaultGlobal: any = null;
    let currentGlobal: any = null;

    try {
      defaultGlobal = require([basePath, Translation.defaultTranslation as string, chunks[0]].join(
        '/'
      ));
    } catch (err) {
      /**
       * Error::defaultGlobal
       */
    }

    try {
      currentGlobal = require([basePath, this.current, chunks[0]].join('/'));
    } catch (err) {
      /**
       * Error::currentGlobal
       */
    }

    let value: any = lodash.get(currentGlobal || {}, accessKey, null);

    if (isNull(value)) {
      value = lodash.get(defaultGlobal || {}, accessKey, null);
    }

    if (isString(value)) {
      Object.keys(replace).forEach((replaceWith: string): void => {
        value = (value as string).split(`{{${replaceWith}}}`).join(replace[replaceWith] as string);
      });
    } else if (isFunction(value)) {
      return value(replace) as string;
    } else if (isArrayLike(value) || isObjectLike(value)) {
      return value;
    } else if (!isNull(value)) {
      return `${type}.${chunks.join('.')}._object`;
    }

    return !isEmpty(value) ? value : `${type}.${chunks.join('.')}._empty`;
  }

  /**
   * Validate params
   * @param current null | string
   * @param commandPath string | undefined
   */
  private static checkValidations(current: null | string = null, commandPath?: string): void {
    if (!isNull(current)) {
      if (!Translation.checkLocaleFormat(current as string)) {
        throw new Error(
          'Value for {current} expected to be a string with format: en, en-US, es, es-MX, etc'
        );
      }

      if (!Translation.supported.includes(current as string)) {
        throw new Error('Value for {current} is not supported with current i18n list');
      }
    }

    if (!isUndefined(commandPath)) {
      if (!isString(commandPath) || isEmpty(commandPath)) {
        throw new Error('Param {commandPath} expected to be a valid string');
      }
    }
  }
}
