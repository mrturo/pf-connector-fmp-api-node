import { Candlestick as CandlestickModel } from '../../domain/model/candlestick.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { StringUtil } from '../../domain/util/string.util';
import { Application as ApplicationError } from '../error/application.error';
enum AdviceFactor {
  PERCENTAGE = 'PERCENTAGE',
  CHANGE = 'CHANGE',
  CANDLESTICK = 'CANDLESTICK'
}
export class Advice {
  public static readonly Factor = AdviceFactor;
  public static SortByPerformance(stocks: any[]): any[] {
    return stocks
      .sort((a: any, b: any) => {
        return b.performance.price - a.performance.price;
      })
      .sort((a: any, b: any) => {
        return b.performance.diff - a.performance.diff;
      })
      .sort((a: any, b: any) => {
        return b.performance.percentage - a.performance.percentage;
      })
      .sort((a: any, b: any) => {
        return b.performance.avgPct - a.performance.avgPct;
      })
      .sort((a: any, b: any) => {
        return b.performance.avgChg - a.performance.avgChg;
      })
      .sort((a: any, b: any) => {
        return b.performance.avgCandle - a.performance.avgCandle;
      });
  }
  public static FilterByPerformance(stocks: any[]): any[] {
    return stocks
      .filter((stockPerformance: any) => {
        return stockPerformance.performance.percentage > 0;
      })
      .filter((stockPerformance: any) => {
        if (stockPerformance.performance.subPeriods) {
          const nSubPeriods = stockPerformance.performance.subPeriods.length;
          if (nSubPeriods > 0) {
            if (
              stockPerformance.performance.subPeriods[0].candlestick &&
              stockPerformance.performance.subPeriods[0].candlestick
                .numericType &&
              stockPerformance.performance.subPeriods[0].candlestick
                .numericType < 0
            ) {
              return false;
            }
            const halfPeriods = Math.ceil(nSubPeriods / 2) + 1;
            let j = 0,
              good = 0,
              bad = 0;
            for (let i = nSubPeriods - 1; i >= 0; i--) {
              if (
                stockPerformance.performance.subPeriods[i] &&
                stockPerformance.performance.subPeriods[i].candlestick &&
                stockPerformance.performance.subPeriods[i].candlestick
                  .numericType
              ) {
                if (
                  j < halfPeriods &&
                  stockPerformance.performance.subPeriods[i].candlestick
                    .numericType <= 0
                ) {
                  return false;
                } else {
                  if (
                    stockPerformance.performance.subPeriods[i].candlestick
                      .numericType > 0
                  ) {
                    good++;
                  } else {
                    bad++;
                  }
                }
              }
              j++;
            }
            return good >= bad;
          }
        }
        return true;
      })
      .filter((stockPerformance: any) => {
        if (stockPerformance.historical) {
          const nDays = stockPerformance.historical.length;
          if (nDays > 0) {
            if (
              stockPerformance.historical[0] &&
              stockPerformance.historical[0].candlestick.color !==
                CandlestickModel.Color.GREEN
            ) {
              return false;
            }
            if (
              stockPerformance.historical[1] &&
              stockPerformance.historical[1].candlestick.color !==
                CandlestickModel.Color.GREEN
            ) {
              return false;
            }
            if (
              stockPerformance.historical[2] &&
              stockPerformance.historical[2].candlestick.color !==
                CandlestickModel.Color.GREEN
            ) {
              return false;
            }
          }
        }
        return true;
      });
  }
  public static FilterByStockTypes(
    stocks: any[],
    maxStocks: number,
    maxSameSector: number,
    maxSameIndustry: number,
    maxSameType: number,
    justCompanies: boolean,
    justETFs: boolean,
    justFounds: boolean
  ): any[] {
    const resultStocks: any[] = [],
      sectors: string[] = [],
      industries: string[] = [],
      types: string[] = [];
    const justTypes: number =
      (justCompanies ? 1 : 0) + (justETFs ? 1 : 0) + (justFounds ? 1 : 0);
    if (justTypes > 1) {
      throw new ApplicationError(
        `You can only choose one type of 'just' stock to advice: ${JSON.stringify(
          { justCompanies, justETFs, justFounds }
        )}})}`
      );
    }
    for (let i = 0; i < stocks.length && resultStocks.length < maxStocks; i++) {
      const stock = stocks[i];
      const localSector: string | undefined = StringUtil.TrimAndCheckEmpty(
        stock.sector
      )?.toUpperCase();
      const localIndustry: string | undefined = StringUtil.TrimAndCheckEmpty(
        stock.industry
      )?.toUpperCase();
      const localType: string | undefined = StringUtil.TrimAndCheckEmpty(
        stock.type
      )?.toUpperCase();
      if (
        (justCompanies === true && localType === StockModel.Type.COMPANY) ||
        (justETFs === true && localType === StockModel.Type.ETF) ||
        (justFounds === true && localType === StockModel.Type.MUTUAL_FUND)
      ) {
        resultStocks.push(stock);
      } else if (
        justCompanies === false &&
        justETFs === false &&
        justFounds === false &&
        types.filter((x) => x === localType).length < maxSameType &&
        (localType !== StockModel.Type.COMPANY ||
          (sectors.filter((x) => x === localSector).length < maxSameSector &&
            industries.filter((x) => x === localIndustry).length <
              maxSameIndustry))
      ) {
        if (localType !== StockModel.Type.COMPANY) {
          if (localSector) {
            sectors.push(localSector);
          }
          if (localIndustry) {
            industries.push(localIndustry);
          }
        }
        if (localType) {
          types.push(localType);
        }
        resultStocks.push(stock);
      }
    }
    return resultStocks;
  }
  public static BuildPerformanceInfo(
    stocks: any[],
    amountUsdToInvest: number | undefined = undefined,
    rateUSD: number | undefined = undefined,
    factor: string = Advice.Factor.PERCENTAGE
  ): any[] {
    if (
      [
        `${Advice.Factor.CANDLESTICK}`,
        `${Advice.Factor.PERCENTAGE}`,
        `${Advice.Factor.CHANGE}`
      ].includes(factor) === false
    ) {
      throw new ApplicationError(`Invalid factor: ${factor}`);
    }
    let sumAvgPct = 0;
    let sumAvgChg = 0;
    let sumAvgCandle = 0;
    for (const stock of stocks) {
      sumAvgPct += stock.performance.avgPct;
      sumAvgChg += stock.performance.avgChg;
      sumAvgCandle += stock.performance.avgCandle;
    }
    let maxPercentage = 100;
    let maxPercentageStock = maxPercentage / stocks.length;
    maxPercentageStock =
      maxPercentageStock === 100
        ? 100
        : maxPercentageStock + maxPercentageStock / 4;
    maxPercentageStock = maxPercentageStock > 100 ? 100 : maxPercentageStock;
    let totalPercentage = 0;
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].historical && stocks[i].historical.length > 3) {
        let trend = 0;
        stocks[i].performance.bullish = false;
        stocks[i].performance.bearish = false;
        for (let j = 3; j < stocks[i].historical.length; j++) {
          const candlestick = stocks[i].historical[j].candlestick;
          const previousCandlestick = stocks[i].historical[j - 1].candlestick;
          if (
            trend === 0 &&
            candlestick.color === CandlestickModel.Color.RED &&
            [
              CandlestickModel.Type.HAMMER.toString(),
              CandlestickModel.Type.INVERTED_HAMMER.toString()
            ].includes(previousCandlestick.type) === true
          ) {
            trend = 1;
          }
        }
        if (trend === 1) {
          stocks[i].performance.bullish = true;
          stocks[i].performance.avgCandle =
            stocks[i].performance.avgCandle * 1.3;
        } else if (trend === -1) {
          stocks[i].performance.bearish = true;
          stocks[i].performance.avgCandle =
            stocks[i].performance.avgCandle * 0.7;
        }
      }
      const avgCandle =
        (stocks[i].performance.avgCandle / sumAvgCandle) * maxPercentage;
      const avgPct = (stocks[i].performance.avgPct / sumAvgPct) * maxPercentage;
      const avgChg = (stocks[i].performance.avgChg / sumAvgChg) * maxPercentage;
      let percentage =
        Math.round(
          (factor === Advice.Factor.CANDLESTICK
            ? avgCandle
            : factor === Advice.Factor.PERCENTAGE
            ? avgPct
            : avgChg) * 100
        ) / 100;
      percentage = Number.isNaN(percentage) ? 100 : percentage;
      percentage =
        percentage > maxPercentageStock ? maxPercentageStock : percentage;
      const amountUSD = amountUsdToInvest
        ? Math.round(((percentage * amountUsdToInvest) / 100) * 100) / 100
        : undefined;
      stocks[i].advice = {
        percentage: percentage,
        amountUSD: amountUSD ? Math.round(amountUSD * 100) / 100 : undefined,
        amountLocal:
          amountUSD && rateUSD ? Math.round(amountUSD * rateUSD) : undefined
      };
      maxPercentage -= percentage;
      sumAvgPct -= stocks[i].performance.avgPct;
      sumAvgChg -= stocks[i].performance.avgChg;
      sumAvgCandle -= stocks[i].performance.avgCandle;
      totalPercentage += percentage;
    }
    let retry = 5;
    while (totalPercentage !== 100 && retry > 0) {
      retry--;
      let newTotalPercentage = 0;
      for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].advice && stocks[i].advice.percentage) {
          let newPercentage =
            Math.round(
              ((+stocks[i].advice.percentage * 100) / totalPercentage) * 100
            ) / 100;
          if (
            i === stocks.length - 1 &&
            newPercentage + newTotalPercentage !== 100
          ) {
            newPercentage =
              newPercentage - (newPercentage + newTotalPercentage - 100);
          }
          const newAmountUSD = amountUsdToInvest
            ? Math.round(((newPercentage * amountUsdToInvest) / 100) * 100) /
              100
            : undefined;
          const newAmountLocal =
            newAmountUSD && rateUSD
              ? Math.round(newAmountUSD * rateUSD * 100) / 100
              : undefined;
          stocks[i].advice = {
            percentage: newPercentage,
            amountUSD: newAmountUSD,
            amountLocal: newAmountLocal
          };
          newTotalPercentage += newPercentage;
        }
      }
      totalPercentage = Math.round(newTotalPercentage * 100) / 100;
    }
    if (totalPercentage > 100) {
      LoggerUtil.warn('totalPercentage > 100: ' + totalPercentage);
    }
    return Advice.SortByPerformance(stocks);
  }
}
