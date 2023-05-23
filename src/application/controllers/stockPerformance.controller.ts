import * as express from 'express';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { StockPerformance as StockPerformanceService } from '../service/stockPerformance.service';
import { QueryRequest as QueryRequestUtil } from '../util/queryRequest.util';
import { Controller as ControllerInterface } from './controller.interface';

export class StockPerformance implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/stockPerformance';
    this.intializeRoutes();
  }
  public async get(request: express.Request, response: express.Response) {
    try {
      const fmpApiKey: string = QueryRequestUtil.getFmpApiKey(
        request.query.fmpApiKey
      );
      const symbol: string = request.params.symbol;
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.findFrequency(request.params.frequency);
      const mainCompanies = await StockPerformanceService.getInfo(
        fmpApiKey,
        [symbol],
        undefined,
        subPeriods
      );
      response.status(200);
      response.json(mainCompanies);
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
  public get path() {
    return this._path;
  }
  public set path(value) {
    this._path = value;
  }
  public get router(): express.Router {
    return this._router;
  }
  public set router(value: express.Router) {
    this._router = value;
  }
  public intializeRoutes() {
    this.router = express.Router();
    this.router.get('/:frequency/:symbol', this.get);
  }
}
