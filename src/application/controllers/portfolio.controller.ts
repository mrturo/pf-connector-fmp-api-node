import * as express from 'express';
import { round } from 'mathjs';
import { Portfolio as PortfolioModel } from '../../domain/model/portfolio.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { Backup as BackupService } from '../service/backup.service';
import { Portfolio as PortfolioService } from '../service/portfolio.service';
import { QueryRequest as QueryRequestUtil } from '../util/queryRequest.util';
import { Controller as ControllerInterface } from './controller.interface';

export class Portfolio implements ControllerInterface {
  private _path!: string;
  private _router!: express.Router;
  constructor() {
    this.path = '/portfolio';
    this.intializeRoutes();
  }
  public async details(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const stocks: Map<string, StockModel> = new Map<string, StockModel>();
      for (const stock of request.body.Portfolio) {
        stocks.set(stock.symbol, new StockModel(stock.symbol, stock.quantity));
      }
      const service: PortfolioService = new PortfolioService(fmpApiKey);
      const portfolio = await service.update(new PortfolioModel(stocks));
      let rateUSD: number | undefined = request.body.rateUSD;
      rateUSD = rateUSD ? round(rateUSD, 0) : undefined;
      const resultStocks = portfolio.json(rateUSD);
      const sectors = portfolio.stocksBySector(rateUSD, portfolio.amountUSD);
      const industries = portfolio
        .stocksByIndustry(rateUSD, portfolio.amountUSD)
        .sort((a: any, b: any) => b.amountUSD - a.amountUSD);
      response.status(200);
      response.json({
        amountUSD: round(portfolio.amountUSD, 2),
        amountLocal: portfolio.amountLocal(rateUSD),
        stocks: resultStocks,
        bySector: sectors,
        byIndustry: industries
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
  public async extended(
    request: express.Request,
    response: express.Response
  ): Promise<express.Response<any, Record<string, any>>> {
    try {
      await BackupService.CreateFolderBase();
      await BackupService.CleanOldData();
      const fmpApiKey: string = QueryRequestUtil.GetFmpApiKey(
        request.query.FmpApiKey
      );
      const stocks: Map<string, StockModel> = new Map<string, StockModel>();
      for (const stock of request.body.Portfolio) {
        stocks.set(stock.symbol, new StockModel(stock.symbol, stock.quantity));
      }
      const portfolio: PortfolioService = new PortfolioService(fmpApiKey);
      const extendedPortfolio = await portfolio.getExtended(
        await portfolio.update(new PortfolioModel(stocks))
      );
      let rateUSD: number | undefined = request.body.rateUSD;
      rateUSD = rateUSD ? round(rateUSD, 0) : undefined;
      const resultStocks = extendedPortfolio.json(rateUSD);
      const sectors = extendedPortfolio.stocksBySector(
        rateUSD,
        extendedPortfolio.amountUSD
      );
      const industries = extendedPortfolio
        .stocksByIndustry(rateUSD, extendedPortfolio.amountUSD)
        .sort((a: any, b: any) => b.amountUSD - a.amountUSD);
      response.status(200);
      response.json({
        amountUSD: round(extendedPortfolio.amountUSD, 2),
        amountLocal: extendedPortfolio.amountLocal(rateUSD),
        stocks: resultStocks,
        bySector: sectors,
        byIndustry: industries
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
    this.router.get('/', this.details);
    this.router.get('/extended', this.extended);
  }
}
