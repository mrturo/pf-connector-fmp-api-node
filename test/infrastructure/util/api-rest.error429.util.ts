import { ApiRest as ApiRestInterface } from '../../../src/infrastructure/util/api-rest.interface.util';

export class ApiRest implements ApiRestInterface {
  private _method!: string;
  private _url!: string;
  constructor(method = '', url = '') {
    this.method = method;
    this.url = url;
  }
  public get method(): string {
    return this._method;
  }
  public set method(value: string) {
    this._method = value;
  }
  public get url(): string {
    return this._url;
  }
  public set url(value: string) {
    this._url = value;
  }
  get json(): object {
    return {
      method: this.method,
      url: this.url
    };
  }
  exe() {
    throw new Error('Request failed with status code 429');
  }
}
