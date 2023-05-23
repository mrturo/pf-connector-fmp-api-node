import * as express from 'express';
import humanizeDuration from 'humanize-duration';
import { Controller as ControllerInterface } from './controller.interface';

export class Base implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/';
    this.intializeRoutes();
  }
  public getHealthCheck(
    request: express.Request,
    response: express.Response
  ): express.Response<any, Record<string, any>> {
    const bodyResult = {
      message: process.env.npm_package_name,
      uptime: humanizeDuration(Math.round(process.uptime() * 1000), {
        language: 'es'
      })
    };
    response.status(200);
    response.json(bodyResult);
    return response;
  }
  public get path(): string {
    return this._path;
  }
  public set path(value: string) {
    this._path = value;
  }
  public get router(): express.Router {
    return this._router;
  }
  public set router(value: express.Router) {
    this._router = value;
  }
  public intializeRoutes(): void {
    this.router = express.Router();
    this.router.get('/', this.getHealthCheck);
  }
}
