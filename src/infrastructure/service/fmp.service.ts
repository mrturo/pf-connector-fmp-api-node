import { Symbol as SymbolUtil } from '../../application/util/symbol.util';
import { Configuration as ConfigurationUtil } from '../../domain/util/configuration.util';
import { Constants as ConstantsUtil } from '../../domain/util/constants.util';
import { ApiRest as ApiRestUtil } from '../util/api-rest.util';

export class FMP {
  private static async ApiRest(url: string): Promise<any> {
    return await ApiRestUtil.exe(url);
  }
  public static async etfHolder(symbol: string | string[]): Promise<any> {
    const result: any[] = [];
    for (const value of SymbolUtil.getSymbol(symbol)) {
      result.push({
        symbol: value,
        holders: await FMP.ApiRest(
          `${ConstantsUtil.FMP_BASE_URL()}etf-holder/${value}?apikey=${ConfigurationUtil.fpmApiKey()}`
        )
      });
    }
    return result.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
  public static async profile(symbol: string | string[]): Promise<any> {
    const allAvailableSymbols = (await FMP.availableTraded()).map(
      (a: any) => a.symbol
    );
    const localSymbol: string[] = SymbolUtil.getSymbol(symbol).filter(
      (x) => allAvailableSymbols.includes(x) === true
    );
    const subSymbol: string[][] = [];
    const maxByGroups = 1000;
    let i = 0;
    for (i = 0; i + maxByGroups < localSymbol.length; i = i + maxByGroups) {
      subSymbol.push(localSymbol.slice(i, i + maxByGroups));
    }
    subSymbol.push(localSymbol.slice(i, localSymbol.length));
    let result: any[] = [];
    for (const sub of subSymbol) {
      result = result.concat(
        await FMP.ApiRest(
          `${ConstantsUtil.FMP_BASE_URL()}profile/${SymbolUtil.getSymbolString(
            sub
          )}?apikey=${ConfigurationUtil.fpmApiKey()}`
        )
      );
    }
    return result.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public static async historicalPriceFull(
    symbol: string | string[]
  ): Promise<any> {
    return (
      await FMP.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}historical-price-full/${SymbolUtil.getSymbolString(
          symbol
        )}?apikey=${ConfigurationUtil.fpmApiKey()}`
      )
    ).historicalStockList.sort((a: any, b: any) =>
      a.symbol.localeCompare(b.symbol)
    );
  }
  public static async availableTraded(): Promise<any> {
    return (
      await FMP.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}available-traded/list?apikey=${ConfigurationUtil.fpmApiKey()}`
      )
    ).sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
}
