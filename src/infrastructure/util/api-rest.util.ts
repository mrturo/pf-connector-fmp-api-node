import axios from 'axios';
import https from 'https';
import { Infrastructure as InfrastructureError } from '../error/infrastructure.error';

export class ApiRest {
  private static readonly method = {
    GET: 'GET',
    HEAD: 'HEAD',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    CONNECT: 'CONNECT',
    OPTIONS: 'OPTIONS',
    TRACE: 'TRACE',
    PATCH: 'PATCH'
  };
  public static async exe(
    url: string,
    method: string | undefined = undefined
  ): Promise<any> {
    try {
      const config: ApiRest = new ApiRest(url, method);
      const res = await axios(config.json);
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new InfrastructureError(`Executing '${url}' => ${error.message}`);
      }
    }
  }
  private _method!: string;
  private _url!: string;
  constructor(url: string, method: string | undefined = undefined) {
    this.method = method;
    this.url = url;
  }
  private get method(): string {
    return this._method;
  }
  private set method(value: string | undefined) {
    value = (value || '').trim().toUpperCase();
    if (value.length === 0) {
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
  private get url(): string {
    return this._url;
  }
  private set url(value: string) {
    value = (value || '').trim();
    if (value.length === 0) {
      throw new InfrastructureError(`URL not found`);
    }
    this._url = value;
  }
  private get json(): object {
    return {
      method: this.method,
      url: this.url,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: false
      })
    };
  }
}
