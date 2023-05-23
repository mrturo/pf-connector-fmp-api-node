import { abs } from 'mathjs';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { Application as ApplicationError } from '../error/application.error';
import { Advice as AdviceUtil } from '../util/advice.util';
import { Symbol as SymbolUtil } from '../util/symbol.util';
import { BaseStocks as BaseStocksService } from './baseStocks.service.interface';
import { StockPerformance as StockPerformanceService } from './stockPerformance.service';

export class Advice {
  private defaultMaxStocksAdvice = 5;
  private _baseStocks!: BaseStocksService;
  private _stockPerformance!: StockPerformanceService;
  constructor(baseStock: BaseStocksService, fmpApiKey: string) {
    this.baseStocks = baseStock;
    this.stockPerformance = new StockPerformanceService(fmpApiKey);
  }
  public get baseStocks(): BaseStocksService {
    return this._baseStocks;
  }
  public set baseStocks(value: BaseStocksService) {
    this._baseStocks = value;
  }
  public get stockPerformance(): StockPerformanceService {
    return this._stockPerformance;
  }
  public set stockPerformance(value: StockPerformanceService) {
    this._stockPerformance = value;
  }
  public async getMomentumInvesting(
    subPeriods:
      | {
          quantity: number;
          frequency: string | number;
        }
      | undefined = undefined,
    frequency: string | number,
    options: {
      maxStocks: number | undefined;
      maxSameSector: number | undefined;
      maxSameIndustry: number | undefined;
      maxSameType: number | undefined;
      rateUSD: number | undefined;
      amountUsdToInvest: number | undefined;
      amountLocalToInvest: number | undefined;
      ignoreList: string[] | undefined;
      date: Date | undefined;
      justCompanies: boolean | undefined;
      justETFs: boolean | undefined;
      justFounds: boolean | undefined;
    } = {
      maxStocks: undefined,
      maxSameSector: undefined,
      maxSameIndustry: undefined,
      maxSameType: undefined,
      rateUSD: undefined,
      amountUsdToInvest: undefined,
      amountLocalToInvest: undefined,
      ignoreList: undefined,
      date: undefined,
      justCompanies: undefined,
      justETFs: undefined,
      justFounds: undefined
    }
  ): Promise<any> {
    options.maxStocks = options.maxStocks
      ? options.maxStocks
      : this.defaultMaxStocksAdvice;
    options.maxSameSector = options.maxSameSector
      ? options.maxSameSector > options.maxStocks
        ? options.maxStocks
        : options.maxSameSector
      : (options.maxStocks / 5) * 3;
    options.maxSameIndustry = options.maxSameIndustry
      ? options.maxSameIndustry > options.maxStocks
        ? options.maxStocks
        : options.maxSameIndustry
      : (options.maxStocks / 5) * 2;
    options.maxSameType = options.maxSameType
      ? options.maxSameType > options.maxStocks
        ? options.maxStocks
        : options.maxSameType
      : (options.maxStocks / 5) * 5;
    options.justCompanies = options.justCompanies
      ? options.justCompanies
      : false;
    options.justETFs = options.justETFs ? options.justETFs : false;
    options.justFounds = options.justFounds ? options.justFounds : false;
    if (
      options.rateUSD &&
      options.amountUsdToInvest &&
      options.amountLocalToInvest
    ) {
      const localAmountLocalToInvest =
        options.amountUsdToInvest * options.rateUSD;
      if (abs(localAmountLocalToInvest - options.amountLocalToInvest) <= 10) {
        options.amountLocalToInvest = localAmountLocalToInvest;
      } else {
        throw new ApplicationError('Invalid amountLocalToInvest');
      }
    } else if (
      options.rateUSD &&
      options.amountUsdToInvest &&
      !options.amountLocalToInvest
    ) {
      options.amountLocalToInvest = options.amountUsdToInvest * options.rateUSD;
    } else if (
      options.rateUSD &&
      !options.amountUsdToInvest &&
      options.amountLocalToInvest
    ) {
      options.amountUsdToInvest = options.amountLocalToInvest / options.rateUSD;
    } else if (
      !options.rateUSD &&
      options.amountUsdToInvest &&
      options.amountLocalToInvest
    ) {
      options.rateUSD = options.amountLocalToInvest / options.amountUsdToInvest;
    }
    options.ignoreList = SymbolUtil.GetSymbol(options.ignoreList);
    const stocks = AdviceUtil.BuildPerformanceInfo(
      AdviceUtil.FilterByStockTypes(
        AdviceUtil.SortByPerformance(
          AdviceUtil.FilterByPerformance(
            await this.stockPerformance.getInfo(
              await this.baseStocks.getAll(),
              options.date,
              options.ignoreList,
              subPeriods,
              frequency
            )
          )
        ),
        options.maxStocks,
        options.maxSameSector,
        options.maxSameIndustry,
        options.maxSameType,
        options.justCompanies,
        options.justETFs,
        options.justFounds
      ),
      options.amountUsdToInvest,
      options.rateUSD
    );
    const finalPerformance: any[] = [];
    let totalAmountUSD = 0;
    let totalAmountLocal = 0;
    let date: Date | undefined = undefined;
    let nextUpdate: Date | undefined = undefined;
    for (const s of stocks) {
      if (s !== undefined && s.performance !== undefined) {
        if (
          s.performance.finalPerformance !== undefined &&
          s.advice !== undefined &&
          s.advice.amountUSD !== undefined
        ) {
          const percentage: number =
            s.performance.finalPerformance.percentage / 100;
          const amountUSD: number = s.advice.amountUSD * percentage;
          const amountLocal: number =
            (s.advice.amountLocal ? s.advice.amountLocal : 1) * percentage;
          date = s.performance.finalPerformance.date;
          totalAmountUSD += amountUSD;
          totalAmountLocal += amountLocal;
          finalPerformance.push({
            symbol: s.symbol,
            percentage: percentage,
            amountUSD: amountUSD,
            amountLocal: amountLocal
          });
        }
        if (s.performance.nextUpdate !== undefined) {
          nextUpdate = s.performance.nextUpdate;
        }
      }
    }
    return {
      stocks: stocks,
      options: options,
      finalPerformance:
        finalPerformance.length > 0
          ? {
              date: date,
              amountUSD: totalAmountUSD,
              amountLocal: totalAmountLocal,
              stocks: finalPerformance
            }
          : undefined,
      nextUpdate: finalPerformance.length > 0 ? undefined : nextUpdate
    };
  }
  public async getMomentumInvestingSimple(
    subPeriods:
      | {
          quantity: number;
          frequency: string | number;
        }
      | undefined = undefined,
    frequency: string | number,
    options: {
      maxStocks: number | undefined;
      maxSameSector: number | undefined;
      maxSameIndustry: number | undefined;
      maxSameType: number | undefined;
      rateUSD: number | undefined;
      amountUsdToInvest: number | undefined;
      amountLocalToInvest: number | undefined;
      ignoreList: string[] | undefined;
      date: Date | undefined;
      justCompanies: boolean | undefined;
      justETFs: boolean | undefined;
      justFounds: boolean | undefined;
    } = {
      maxStocks: undefined,
      maxSameSector: undefined,
      maxSameIndustry: undefined,
      maxSameType: undefined,
      rateUSD: undefined,
      amountUsdToInvest: undefined,
      amountLocalToInvest: undefined,
      ignoreList: undefined,
      date: undefined,
      justCompanies: undefined,
      justETFs: undefined,
      justFounds: undefined
    }
  ): Promise<any> {
    return [
      ...new Set(
        (
          await this.getMomentumInvesting(subPeriods, frequency, {
            maxStocks: options.maxStocks,
            maxSameSector: options.maxSameSector,
            maxSameIndustry: options.maxSameIndustry,
            maxSameType: options.maxSameType,
            rateUSD: options.rateUSD,
            amountUsdToInvest: options.amountUsdToInvest,
            amountLocalToInvest: options.amountLocalToInvest,
            ignoreList: options.ignoreList,
            date: options.date,
            justCompanies: options.justCompanies,
            justETFs: options.justETFs,
            justFounds: options.justFounds
          })
        ).stocks.map((a: any) => {
          return {
            symbol: a.symbol,
            name: a.name,
            amountUSD: a.advice.amountUSD
          };
        })
      )
    ];
  }
  public async getHistoricalPerformance(
    subPeriods:
      | {
          quantity: number;
          frequency: string | number;
        }
      | undefined = undefined,
    frequency: string | number,
    options: {
      maxStocks: number | undefined;
      maxSameSector: number | undefined;
      maxSameIndustry: number | undefined;
      maxSameType: number | undefined;
      rateUSD: number | undefined;
      amountUsdToInvest: number | undefined;
      amountLocalToInvest: number | undefined;
      ignoreList: string[] | undefined;
      date: Date | undefined;
      justCompanies: boolean | undefined;
      justETFs: boolean | undefined;
      justFounds: boolean | undefined;
    } = {
      maxStocks: undefined,
      maxSameSector: undefined,
      maxSameIndustry: undefined,
      maxSameType: undefined,
      rateUSD: undefined,
      amountUsdToInvest: undefined,
      amountLocalToInvest: undefined,
      ignoreList: undefined,
      date: undefined,
      justCompanies: undefined,
      justETFs: undefined,
      justFounds: undefined
    }
  ): Promise<any> {
    options.maxStocks = options.maxStocks
      ? options.maxStocks
      : this.defaultMaxStocksAdvice;
    options.maxSameSector = options.maxSameSector
      ? options.maxSameSector > options.maxStocks
        ? options.maxStocks
        : options.maxSameSector
      : (options.maxStocks / 5) * 3;
    options.maxSameIndustry = options.maxSameIndustry
      ? options.maxSameIndustry > options.maxStocks
        ? options.maxStocks
        : options.maxSameIndustry
      : (options.maxStocks / 5) * 2;
    options.maxSameType = options.maxSameType
      ? options.maxSameType > options.maxStocks
        ? options.maxStocks
        : options.maxSameType
      : (options.maxStocks / 5) * 5;
    options.justCompanies = options.justCompanies
      ? options.justCompanies
      : false;
    options.justETFs = options.justETFs ? options.justETFs : false;
    options.justFounds = options.justFounds ? options.justFounds : false;
    options.ignoreList = SymbolUtil.GetSymbol(options.ignoreList);
    let stocks: any[] = [];
    let totalAmountUSD = 0;
    let totalAmountLocal = 0;
    let date: Date | undefined = undefined;
    let nextUpdate: Date | undefined = undefined;
    let finalPerformance: any[] = [];
    let running = true;
    let i = 0;
    while (running) {
      console.log('date', options.date);
      console.log('amountUsdToInvest', options.amountUsdToInvest);
      stocks = [];
      totalAmountUSD = 0;
      totalAmountLocal = 0;
      date = undefined;
      nextUpdate = undefined;
      if (
        options.rateUSD &&
        options.amountUsdToInvest &&
        options.amountLocalToInvest
      ) {
        const localAmountLocalToInvest =
          options.amountUsdToInvest * options.rateUSD;
        if (abs(localAmountLocalToInvest - options.amountLocalToInvest) <= 10) {
          options.amountLocalToInvest = localAmountLocalToInvest;
        } else {
          throw new ApplicationError('Invalid amountLocalToInvest');
        }
      } else if (
        options.rateUSD &&
        options.amountUsdToInvest &&
        !options.amountLocalToInvest
      ) {
        options.amountLocalToInvest =
          options.amountUsdToInvest * options.rateUSD;
      } else if (
        options.rateUSD &&
        !options.amountUsdToInvest &&
        options.amountLocalToInvest
      ) {
        options.amountUsdToInvest =
          options.amountLocalToInvest / options.rateUSD;
      } else if (
        !options.rateUSD &&
        options.amountUsdToInvest &&
        options.amountLocalToInvest
      ) {
        options.rateUSD =
          options.amountLocalToInvest / options.amountUsdToInvest;
      }
      stocks = AdviceUtil.BuildPerformanceInfo(
        AdviceUtil.FilterByStockTypes(
          AdviceUtil.SortByPerformance(
            AdviceUtil.FilterByPerformance(
              await this.stockPerformance.getInfo(
                await this.baseStocks.getAll(),
                options.date,
                options.ignoreList,
                subPeriods,
                frequency
              )
            )
          ),
          options.maxStocks,
          options.maxSameSector,
          options.maxSameIndustry,
          options.maxSameType,
          options.justCompanies,
          options.justETFs,
          options.justFounds
        ),
        options.amountUsdToInvest,
        options.rateUSD
      );
      finalPerformance = [];
      for (const s of stocks) {
        if (s !== undefined && s.performance !== undefined) {
          if (
            s.performance.finalPerformance !== undefined &&
            s.advice !== undefined &&
            s.advice.amountUSD !== undefined
          ) {
            const percentage: number =
              s.performance.finalPerformance.percentage / 100;
            const amountUSD: number = s.advice.amountUSD * percentage;
            const amountLocal: number =
              (s.advice.amountLocal ? s.advice.amountLocal : 1) * percentage;
            date = s.performance.finalPerformance.date;
            totalAmountUSD += amountUSD;
            totalAmountLocal += amountLocal;
            finalPerformance.push({
              symbol: s.symbol,
              percentage: percentage,
              amountUSD: amountUSD,
              amountLocal: amountLocal
            });
          }
          if (s.performance.nextUpdate !== undefined) {
            nextUpdate = s.performance.nextUpdate;
          }
        }
      }
      const nextCheck = PeriodModel.PrepareDiffPeriods(frequency);
      const newDate = options.date
        ? new Date(
            options.date.getFullYear() + nextCheck.years,
            options.date.getMonth() + nextCheck.months,
            options.date.getDate() + nextCheck.days + (i === 0 ? 1 : 0)
          )
        : undefined;
      let newAmountUsdToInvest =
        Math.round(((options.amountUsdToInvest || 0) + totalAmountUSD) * 100) /
        100;
      newAmountUsdToInvest =
        newAmountUsdToInvest < 0 ? 0 : newAmountUsdToInvest;
      if (newDate && newDate < new Date() && newAmountUsdToInvest > 0) {
        options.date = newDate;
        options.amountUsdToInvest = newAmountUsdToInvest;
        options.amountLocalToInvest = undefined;
      } else {
        running = false;
        console.log('*** finalDate', newDate);
        console.log('*** finalAmountUsd', newAmountUsdToInvest);
      }
      i++;
    }
    return {
      stocks: stocks,
      options: options,
      finalPerformance:
        finalPerformance.length > 0
          ? {
              date: date,
              amountUSD: totalAmountUSD,
              amountLocal: totalAmountLocal,
              stocks: finalPerformance
            }
          : undefined,
      nextUpdate: finalPerformance.length > 0 ? undefined : nextUpdate
    };
  }
}
