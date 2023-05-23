import { Candlestick as CandlestickModel } from '../../domain/model/candlestick.model';
import { Performance as PerformanceModel } from '../../domain/model/performance.model';
import { Period as PeriodModel } from '../../domain/model/period.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { StringUtil } from '../../domain/util/string.util';
import { FMP as FMPService } from '../../infrastructure/service/fmp.service';
import { Symbol as SymbolUtil } from '../util/symbol.util';

export class StockPerformance {
  private _fmp!: FMPService;
  constructor(fmpApiKey: string) {
    this.fmp = new FMPService(undefined, fmpApiKey);
  }
  public async getInfo(
    symbols: string[],
    date: Date | undefined = undefined,
    ignoreList: string[] = [],
    subPeriods = PeriodModel.FourWeeksWeekly.subperiods,
    frequency = PeriodModel.FourWeeksWeekly.frequency
  ): Promise<any> {
    const period: PeriodModel = new PeriodModel(date, subPeriods, frequency);
    const allAvailableSymbols = (await this.fmp.availableTraded()).map(
      (a: any) => a.symbol
    );
    const validSymbols: string[] = SymbolUtil.GetSymbol(symbols)
      .filter((x) => allAvailableSymbols.includes(x) === true)
      .filter((symbol) => {
        return ignoreList.includes(symbol) === false;
      });
    const profiles = await this.fmp.profile(validSymbols);
    const allHistoricalPriceFull = await this.fmp.historicalPriceFull(
      validSymbols
    );
    return (
      await Promise.all(
        profiles.map(async (profile: any) => {
          const historicalPriceFull = allHistoricalPriceFull.filter(
            (x: any) => x && x.symbol === profile.symbol
          )[0];
          if (
            historicalPriceFull &&
            historicalPriceFull.historical &&
            historicalPriceFull.historical.length > 0
          ) {
            profile.historicalPrice = [];
            for (let i = 0; i < historicalPriceFull.historical.length; i++) {
              const thisCandlestick = new CandlestickModel(
                historicalPriceFull.historical[i].open,
                historicalPriceFull.historical[i].close,
                historicalPriceFull.historical[i].low,
                historicalPriceFull.historical[i].high
              );
              let previousCandlestick: CandlestickModel | undefined = undefined;
              if (i < historicalPriceFull.historical.length - 1) {
                previousCandlestick = new CandlestickModel(
                  historicalPriceFull.historical[i + 1].open,
                  historicalPriceFull.historical[i + 1].close,
                  historicalPriceFull.historical[i + 1].low,
                  historicalPriceFull.historical[i + 1].high
                );
              }
              let nextCandlestick: CandlestickModel | undefined = undefined;
              if (i > 0) {
                nextCandlestick = new CandlestickModel(
                  historicalPriceFull.historical[i - 1].open,
                  historicalPriceFull.historical[i - 1].close,
                  historicalPriceFull.historical[i - 1].low,
                  historicalPriceFull.historical[i - 1].high
                );
              }
              profile.historicalPrice.push({
                date: new Date(historicalPriceFull.historical[i].date),
                open: historicalPriceFull.historical[i].open,
                close: historicalPriceFull.historical[i].close,
                low: historicalPriceFull.historical[i].low,
                high: historicalPriceFull.historical[i].high,
                candlestick: thisCandlestick.json(
                  previousCandlestick,
                  nextCandlestick
                )
              });
            }
            profile.historicalPrice = profile.historicalPrice.filter(
              (a: any) =>
                period.nextUpdate.getTime() >= a.date.getTime() &&
                period.from.getTime() <= a.date.getTime()
            );
            if (
              profile.historicalPrice &&
              profile.historicalPrice.length > 0 &&
              profile.historicalPrice[0] &&
              profile.historicalPrice[profile.historicalPrice.length - 1]
            ) {
              const overallPerformance = PerformanceModel.BuildFromHistory(
                profile.historicalPrice,
                period.from,
                period.to,
                period.nextUpdate
              );
              const subPeriodPerformances: PerformanceModel[] = [];
              for (const subPeriod of period.subPeriods) {
                const subPeriodPerformance = PerformanceModel.BuildFromHistory(
                  profile.historicalPrice,
                  subPeriod.from,
                  subPeriod.to
                );
                if (subPeriodPerformance) {
                  subPeriodPerformances.push(subPeriodPerformance);
                }
              }
              let symbol: string | undefined = undefined;
              let name: string | undefined = undefined;
              if (overallPerformance) {
                const localSymbol = profile.symbol.trim().toUpperCase();
                if (localSymbol !== '') {
                  symbol = localSymbol;
                }
                const localName = profile.companyName.trim().toUpperCase();
                if (localName !== '') {
                  name = localName;
                }
                const type: string =
                  profile.isEtf === true
                    ? StockModel.Type.ETF
                    : profile.isFund === true
                    ? StockModel.Type.MUTUAL_FUND
                    : StockModel.Type.COMPANY;
                const industry: string = StringUtil.TrimOrReplace(
                  profile.industry,
                  type
                ).toUpperCase();
                const sector: string = StringUtil.TrimOrReplace(
                  profile.sector,
                  type
                ).toUpperCase();
                return {
                  symbol: symbol,
                  name: name,
                  industry: industry,
                  sector: sector,
                  type: type,
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
  public get fmp(): FMPService {
    return this._fmp;
  }
  public set fmp(value: FMPService) {
    this._fmp = value;
  }
}
