import { Performance as PerformanceModel } from '../../domain/model/performance.model';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { FMP as FMPService } from '../../infrastructure/service/fmp.service';
import { Symbol as SymbolUtil } from '../util/symbol.util';

export class StockPerformance {
  public static async getInfo(
    fmpApiKey: string,
    symbols: string[],
    date: Date | undefined = undefined,
    subPeriods = PeriodModel.fourWeeksWeekly.value
  ): Promise<any> {
    const period: PeriodModel = new PeriodModel(date, subPeriods);
    const fmp: FMPService = new FMPService(undefined, fmpApiKey);
    const allAvailableSymbols = (await fmp.availableTraded()).map(
      (a: any) => a.symbol
    );
    const validSymbols: string[] = SymbolUtil.getSymbol(symbols).filter(
      (x) => allAvailableSymbols.includes(x) === true
    );
    const profiles = await fmp.profile(validSymbols);
    const allHistoricalPriceFull = await fmp.historicalPriceFull(validSymbols);
    return (
      await Promise.all(
        profiles.map(async (profile: any) => {
          const historicalPriceFull = allHistoricalPriceFull.filter(
            (x: any) => x && x.symbol === profile.symbol
          )[0];
          if (historicalPriceFull && historicalPriceFull.historical) {
            profile.historicalPrice = historicalPriceFull.historical
              .map((a: any) => {
                return { date: new Date(a.date), open: a.open, close: a.close };
              })
              .filter(
                (a: any) =>
                  period.to.getTime() >= a.date.getTime() &&
                  period.from.getTime() <= a.date.getTime()
              );
            if (profile.historicalPrice && profile.historicalPrice.length > 0) {
              const overallPerformance = PerformanceModel.buildFromHistory(
                profile.historicalPrice
              );
              const subPeriodPerformances: PerformanceModel[] = [];
              for (const subPeriod of period.subPeriods) {
                const subPeriodPerformance = PerformanceModel.buildFromHistory(
                  profile.historicalPrice,
                  subPeriod.from,
                  subPeriod.to
                );
                if (subPeriodPerformance) {
                  subPeriodPerformances.push(subPeriodPerformance);
                }
              }
              if (overallPerformance) {
                return {
                  symbol: profile.symbol,
                  name: profile.companyName,
                  industry: profile.industry,
                  sector: profile.sector,
                  type:
                    profile.isEtf === true
                      ? StockModel.type.ETF
                      : profile.isFund === true
                      ? StockModel.type.MUTUAL_FUND
                      : StockModel.type.COMPANY,
                  performance: overallPerformance.json(subPeriodPerformances),
                  historical: profile.historicalPrice
                };
              }
            }
          }
        })
      )
    ).filter((a: any) => a && a.historical && a.historical.length > 0);
  }
}
