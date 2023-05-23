import * as express from 'express';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { Backup as BackupService } from '../service/backup.service';
import { Controller as ControllerInterface } from './controller.interface';

export class Backup implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/backup';
    this.intializeRoutes();
  }
  public async cleanOldData(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      response.status(200);
      response.json({
        message: 'Data cleaned successfully'
      });
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message.trim() !== '') {
          errorMsg = error.message.trim();
        }
        if (error.stack && error.stack.trim() !== '') {
          LoggerUtil.error(error.stack.trim());
        } else {
          LoggerUtil.error(errorMsg);
        }
      }
      response.status(500);
      response.json({
        message: errorMsg
      });
    }
    return response;
  }
  public async cleanAllData(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CleanAllData();
      response.status(200);
      response.json({
        message: 'Data cleaned successfully'
      });
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message.trim() !== '') {
          errorMsg = error.message.trim();
        }
        if (error.stack && error.stack.trim() !== '') {
          LoggerUtil.error(error.stack.trim());
        } else {
          LoggerUtil.error(errorMsg);
        }
      }
      response.status(500);
      response.json({
        message: errorMsg
      });
    }
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
    this.router.get('/cleanOldData', this.cleanOldData);
    this.router.get('/cleanAllData', this.cleanAllData);
  }
}
