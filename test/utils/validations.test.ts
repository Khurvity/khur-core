import { trim, trimLines } from '../../src/utils/validations';

/*
|--------------------------------------------------------------------------
| ...
|--------------------------------------------------------------------------
*/

describe('Remove spaces', () => {
  it('Remove extra spaces', () => {
    const original: string =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const content: string =
      '    Lorem ipsum dolor    sit amet,         consectetur adipisicing elit, sed do eiusmod tempor incididunt ut       labore et dolore magna      aliqua.     ';

    expect(trim(content)).toEqual(original);
  });

  it('Remove including line breaks', () => {
    const original: string =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const content: string = `
      Lorem ipsum dolor    sit amet,         consectetur adipisicing


      elit, sed do eiusmod tempor incididunt ut       labore et dolore magna      aliqua.
    `;

    expect(trim(content)).toEqual(original);
  });
});

/*
|--------------------------------------------------------------------------
| ...
|--------------------------------------------------------------------------
*/

describe('Remove Extra Line Breaks', () => {
  it('Remove including line breaks', () => {
    const original: string = `Lorem ipsum dolor    sit amet,         consectetur adipisicing




      elit, sed do eiusmod tempor  incididunt ut       labore et dolore magna      aliqua.



      asdasdasd`;
    const content: string = `


      Lorem ipsum dolor    sit amet,         consectetur adipisicing




      elit, sed do eiusmod tempor  incididunt ut       labore et dolore magna      aliqua.



      asdasdasd

    `;

    expect(trimLines(content)).toEqual(original);
  });
});
