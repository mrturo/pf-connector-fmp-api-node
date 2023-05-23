import * as express from 'express';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { DateUtil } from '../../domain/util/date.util';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { Backup as BackupService } from '../service/backup.service';
import { StockPerformance as StockPerformanceService } from '../service/stockPerformance.service';
import { QueryRequest as QueryRequestUtil } from '../util/queryRequest.util';
import { Symbol as SymbolUtil } from '../util/symbol.util';
import { Controller as ControllerInterface } from './controller.interface';

export class StockPerformance implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/stockPerformance';
    this.intializeRoutes();
  }
  public async get(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const symbol: string = request.params.symbol;
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.SubPeriods(request.params.frequency);
      const stockPerformance: StockPerformanceService =
        new StockPerformanceService(fmpApiKey);
      let ignoreList: string[] = SymbolUtil.GetSymbol(request.body.ignoreList);
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.personalIgnoreList)
      );
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.brokerIgnoreList)
      );
      const mainCompanies = await stockPerformance.getInfo(
        [symbol],
        DateUtil.SetDate(request.body.date),
        SymbolUtil.GetSymbol(ignoreList),
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
    this.router.get('/:frequency/:symbol', this.get);
  }
}
