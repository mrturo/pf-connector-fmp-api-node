import * as express from 'express';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { DateUtil } from '../../domain/util/date.util';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { Advice as AdviceService } from '../service/advice.service';
import { Backup as BackupService } from '../service/backup.service';
import { BaseStocks as BaseStocksService } from '../service/baseStocks.service';
import { StockPerformance as StockPerformanceService } from '../service/stockPerformance.service';
import { QueryRequest as QueryRequestUtil } from '../util/queryRequest.util';
import { Symbol as SymbolUtil } from '../util/symbol.util';
import { Controller as ControllerInterface } from './controller.interface';

export class Advice implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/advice';
    this.intializeRoutes();
  }
  public async getBase(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.SubPeriods(request.params.frequency);
      const frequency: string | number = PeriodModel.Frequency(
        request.params.frequency
      );
      let ignoreList: string[] = SymbolUtil.GetSymbol(request.body.ignoreList);
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.personalIgnoreList)
      );
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.brokerIgnoreList)
      );
      const baseStocks: BaseStocksService = new BaseStocksService(
        fmpApiKey,
        ignoreList
      );
      const symbols: string[] = await baseStocks.getAll();
      const stockPerformance: StockPerformanceService =
        new StockPerformanceService(fmpApiKey);
      response.status(200);
      response.json(
        await stockPerformance.getInfo(
          symbols,
          request.body.date,
          ignoreList,
          subPeriods,
          frequency
        )
      );
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message && error.message.trim() !== '') {
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
  public async getMomentumInvesting(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.SubPeriods(request.params.frequency);
      const frequency: string | number = PeriodModel.Frequency(
        request.params.frequency
      );
      let ignoreList: string[] = SymbolUtil.GetSymbol(request.body.ignoreList);
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.personalIgnoreList)
      );
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.brokerIgnoreList)
      );
      const baseStocks: BaseStocksService = new BaseStocksService(
        fmpApiKey,
        ignoreList
      );
      const advice: AdviceService = new AdviceService(baseStocks, fmpApiKey);
      const json = await advice.getMomentumInvesting(subPeriods, frequency, {
        maxStocks: request.body.maxStocks,
        maxSameSector: request.body.maxSameSector,
        maxSameIndustry: request.body.maxSameIndustry,
        maxSameType: request.body.maxSameType,
        rateUSD: request.body.rateUSD,
        amountUsdToInvest: request.body.amountUsdToInvest,
        amountLocalToInvest: request.body.amountLocalToInvest,
        ignoreList: SymbolUtil.GetSymbol(ignoreList),
        date: DateUtil.SetDate(request.body.date),
        justCompanies: request.body.justCompanies,
        justETFs: request.body.justETFs,
        justFounds: request.body.justFounds
      });
      response.status(200);
      response.json(json);
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message && error.message.trim() !== '') {
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
  public async getMomentumInvestingSimple(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.SubPeriods(request.params.frequency);
      const frequency: string | number = PeriodModel.Frequency(
        request.params.frequency
      );
      let ignoreList: string[] = SymbolUtil.GetSymbol(request.body.ignoreList);
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.personalIgnoreList)
      );
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.brokerIgnoreList)
      );
      const baseStocks: BaseStocksService = new BaseStocksService(
        fmpApiKey,
        ignoreList
      );
      const advice: AdviceService = new AdviceService(baseStocks, fmpApiKey);
      const json = await advice.getMomentumInvestingSimple(
        subPeriods,
        frequency,
        {
          maxStocks: request.body.maxStocks,
          maxSameSector: request.body.maxSameSector,
          maxSameIndustry: request.body.maxSameIndustry,
          maxSameType: request.body.maxSameType,
          rateUSD: request.body.rateUSD,
          amountUsdToInvest: request.body.amountUsdToInvest,
          amountLocalToInvest: request.body.amountLocalToInvest,
          ignoreList: SymbolUtil.GetSymbol(ignoreList),
          date: DateUtil.SetDate(request.body.date),
          justCompanies: request.body.justCompanies,
          justETFs: request.body.justETFs,
          justFounds: request.body.justFounds
        }
      );
      response.status(200);
      response.json(json);
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message && error.message.trim() !== '') {
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
  public async getHistoricalPerformance(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const subPeriods: {
        quantity: number;
        frequency: string | number;
      } = PeriodModel.SubPeriods(request.params.frequency);
      const frequency: string | number = PeriodModel.Frequency(
        request.params.frequency
      );
      let ignoreList: string[] = SymbolUtil.GetSymbol(request.body.ignoreList);
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.personalIgnoreList)
      );
      ignoreList = ignoreList.concat(
        SymbolUtil.GetSymbol(request.body.brokerIgnoreList)
      );
      const baseStocks: BaseStocksService = new BaseStocksService(
        fmpApiKey,
        ignoreList
      );
      const advice: AdviceService = new AdviceService(baseStocks, fmpApiKey);
      response.status(200);
      response.json(
        await advice.getHistoricalPerformance(subPeriods, frequency, {
          maxStocks: request.body.maxStocks,
          maxSameSector: request.body.maxSameSector,
          maxSameIndustry: request.body.maxSameIndustry,
          maxSameType: request.body.maxSameType,
          rateUSD: request.body.rateUSD,
          amountUsdToInvest: request.body.amountUsdToInvest,
          amountLocalToInvest: request.body.amountLocalToInvest,
          ignoreList: SymbolUtil.GetSymbol(ignoreList),
          date: DateUtil.SetDate(request.body.date),
          justCompanies: request.body.justCompanies,
          justETFs: request.body.justETFs,
          justFounds: request.body.justFounds
        })
      );
    } catch (error) {
      let errorMsg = 'Server error';
      if (error instanceof Error) {
        if (error.message && error.message.trim() !== '') {
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
    this.router.get('/:frequency/base/', this.getBase);
    this.router.get(
      '/:frequency/momentumInvesting/',
      this.getMomentumInvesting
    );
    this.router.get(
      '/:frequency/momentumInvesting/simple',
      this.getMomentumInvestingSimple
    );
    this.router.get(
      '/:frequency/historicalPerformance/',
      this.getHistoricalPerformance
    );
  }
}
