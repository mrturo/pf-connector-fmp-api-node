import axios from 'axios';
import https from 'https';
import { StringUtil } from '../../domain/util/string.util';
import { Infrastructure as InfrastructureError } from '../error/infrastructure.error';
import { ApiRest as ApiRestInterface } from './api-rest.interface.util';

export class ApiRest implements ApiRestInterface {
  private static readonly method = {
    CONNECT: 'CONNECT',
    DELETE: 'DELETE',
    GET: 'GET',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
    PATCH: 'PATCH',
    POST: 'POST',
    PUT: 'PUT',
    TRACE: 'TRACE'
  };
  public static async exe(
    url: string,
    method: string | undefined = undefined
  ): Promise<any> {
    try {
      const apiRest: ApiRest = new ApiRest(url, method);
      return await apiRest.exe();
    } catch (error) {
      if (error instanceof Error) {
        throw error.message.startsWith(`Executing '${url}' => `) === true
          ? error
          : new InfrastructureError(`Executing '${url}' => ${error.message}`);
      }
    }
  }
  private _method!: string;
  private _url!: string;
  constructor(url: string, method: string | undefined = undefined) {
    this.method = method;
    this.url = url;
  }
  public get method(): string {
    return this._method;
  }
  public set method(value: string | undefined) {
    value = StringUtil.TrimAndCheckEmpty(value?.toUpperCase());
    if (!value) {
      value = ApiRest.method.GET;
    } else if (
      [
        ApiRest.method.GET,
        ApiRest.method.HEAD,
        ApiRest.method.POST,
        ApiRest.method.PUT,
        ApiRest.method.DELETE,
        ApiRest.method.CONNECT,
        ApiRest.method.OPTIONS,
        ApiRest.method.TRACE,
        ApiRest.method.PATCH
      ].includes(value) === false
    ) {
      throw new InfrastructureError(`Invalid HTTP Method: ${value}`);
    }
    this._method = value;
  }
  public get url(): string {
    return this._url;
  }
  public set url(value: string) {
    const localValue = StringUtil.TrimAndCheckEmpty(value);
    if (!localValue) {
      throw new InfrastructureError(`URL not found`);
    }
    this._url = localValue;
  }
  public get json(): object {
    return {
      method: this.method,
      url: this.url,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 100000,
      httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: false
      })
    };
  }
  public async exe(): Promise<any> {
    try {
      const res = await axios(this.json);
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new InfrastructureError(
          `Executing '${this.url}' => ${error.message}`
        );
      }
    }
  }
}
