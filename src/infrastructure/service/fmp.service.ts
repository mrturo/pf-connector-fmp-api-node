import { Symbol as SymbolUtil } from '../../application/util/symbol.util';
import { Configuration as ConfigurationUtil } from '../../domain/util/configuration.util';
import { Constants as ConstantsUtil } from '../../domain/util/constants.util';
import { ApiRest as ApiRestInterface } from '../util/api-rest.interface.util';
import { ApiRest as ApiRestUtil } from '../util/api-rest.util';

export class FMP {
  public static validApiKey(apiKey: string | undefined): boolean {
    const isValid: boolean = (apiKey || '').trim() !== '';
    if (isValid === false) {
      throw new Error('FMP API KEY is not valid');
    }
    return isValid;
  }
  private _apiRest!: ApiRestInterface;
  private _apiKey!: string;
  constructor(
    apiRest: ApiRestInterface | undefined = undefined,
    apiKey: string = ConfigurationUtil.fmpApiKey()
  ) {
    this.apiRest = apiRest ? apiRest : new ApiRestUtil('url');
    this.apiKey = apiKey.trim();
  }
  public get apiRest(): ApiRestInterface {
    return this._apiRest;
  }
  public set apiRest(value: ApiRestInterface) {
    this._apiRest = value;
  }
  public get apiKey(): string {
    return this._apiKey;
  }
  public set apiKey(value: string) {
    this._apiKey = value;
  }
  public async ApiRest(url: string, execution = 1): Promise<any> {
    try {
      this.apiRest.url = url;
      return await this.apiRest.exe();
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Request failed with status code 429') ===
            true &&
          execution < 5
        ) {
          return this.ApiRest(url, execution++);
        } else {
          throw error;
        }
      }
    }
  }

  public async etfHolder(symbol: string | string[]): Promise<any> {
    FMP.validApiKey(this.apiKey);
    return (
      await Promise.all(
        SymbolUtil.getSymbol(symbol).map(async (value) => {
          return {
            symbol: value,
            holders: await this.ApiRest(
              `${ConstantsUtil.FMP_BASE_URL()}etf-holder/${value}?apikey=${
                this.apiKey
              }`
            )
          };
        })
      )
    ).sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
  public async profile(symbol: string | string[]): Promise<any> {
    FMP.validApiKey(this.apiKey);
    const allAvailableSymbols = (await this.availableTraded()).map(
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
        await this.ApiRest(
          `${ConstantsUtil.FMP_BASE_URL()}profile/${SymbolUtil.getSymbolString(
            sub
          )}?apikey=${this.apiKey}`
        )
      );
    }
    return result.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async historicalPriceFull(symbol: string | string[]): Promise<any> {
    FMP.validApiKey(this.apiKey);
    return []
      .concat(
        ...(await Promise.all(
          SymbolUtil.chunkSymbolString(symbol, 5).map(async (chunked) => {
            const result = await this.ApiRest(
              `${ConstantsUtil.FMP_BASE_URL()}historical-price-full/${chunked}?apikey=${
                this.apiKey
              }`
            );
            return result.historicalStockList
              ? result.historicalStockList
              : result;
          })
        ))
      )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async availableTraded(): Promise<any> {
    FMP.validApiKey(this.apiKey);
    return (
      await this.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}available-traded/list?apikey=${
          this.apiKey
        }`
      )
    ).sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async sp500(): Promise<string[]> {
    FMP.validApiKey(this.apiKey);
    return (
      await this.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}sp500_constituent?apikey=${this.apiKey}`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
  public async nasdaq(): Promise<string[]> {
    FMP.validApiKey(this.apiKey);
    return (
      await this.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}nasdaq_constituent?apikey=${
          this.apiKey
        }`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
  public async dowJones(): Promise<string[]> {
    FMP.validApiKey(this.apiKey);
    return (
      await this.ApiRest(
        `${ConstantsUtil.FMP_BASE_URL()}dowjones_constituent?apikey=${
          this.apiKey
        }`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
}
