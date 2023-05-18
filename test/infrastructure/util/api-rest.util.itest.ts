import { ApiRest as ApiRestUtil } from '../../../src/infrastructure/util/api-rest.util';

describe('Class ApiRest Util', () => {
  it('Happy Path 1', async () => {
    const result: any = await ApiRestUtil.exe(
      'https://api.publicapis.org/random'
    );
    expect(result.count).toBe(1);
  });
  it('Happy Path 2', async () => {
    const result: any = await ApiRestUtil.exe(
      'https://api.publicapis.org/random',
      'GET'
    );
    expect(result.count).toBe(1);
  });
  it('Not 200 OK', async () => {
    const url = 'https://api.publicapis.org/rando';
    let errorMsg = '';
    try {
      await ApiRestUtil.exe(url);
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(
      `Executing '${url}' => Request failed with status code 404`
    );
  });
  it('Invalid HTTP Method', async () => {
    const url = 'https://api.publicapis.org/random';
    let errorMsg = '';
    try {
      await ApiRestUtil.exe(url, 'xxx');
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(`Executing '${url}' => Invalid HTTP Method: XXX`);
  });
  it('URL not found', async () => {
    const url = '';
    let errorMsg = '';
    try {
      await ApiRestUtil.exe(url);
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(`Executing '${url}' => URL not found`);
  });
});
