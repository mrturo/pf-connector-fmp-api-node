import { Constants as ConstantsUtil } from '../../domain/util/constants.util';
import { FMP as FmpService } from '../../infrastructure/service/fmp.service';
import { BaseStocks as BaseStocksInterface } from './baseStocks.service.interface';

export class BaseStocks implements BaseStocksInterface {
  private _ignoreList!: string[];
  private _fmp!: FmpService;
  constructor(fmpApiKey: string, ignoreList: string[] = []) {
    this.ignoreList = ignoreList;
    this.fmp = new FmpService(undefined, fmpApiKey);
  }
  private prepared(symbols: string[]): string[] {
    const result: string[] = [
      ...new Set(
        Array.prototype
          .concat(...[symbols])
          .sort((a: string, b: string) => a.localeCompare(b))
      )
    ];
    return result.filter((symbol) => {
      return this.ignoreList.includes(symbol) === false;
    });
  }
  private getETFs(): string[] {
    const result: string[] = ConstantsUtil.VANGUARD_ETF()
      .concat(ConstantsUtil.BLACKROCK_ETF())
      .concat(ConstantsUtil.STATE_STREET_GLOBAL_ADVISORS_ETF())
      .concat(ConstantsUtil.INVESCO_ETF())
      .concat(ConstantsUtil.CHARLES_SCHWAB_ETF());
    return this.prepared(result);
  }
  private async getETFHolders(): Promise<string[]> {
    const result: string[] = [];
    /* const holders: any[] = [];
    const fmp = new FmpService(undefined, this.FmpApiKey);
    holders = await fmp.etfHolder(BaseStocks.getETFs());
    for (const holder of holders) {
      result.push(holder.symbol);
    } */
    return this.prepared(result);
  }
  private async getIndexedCompanies(): Promise<string[]> {
    const result: string[] = (await this.fmp.dowJones())
      .concat(await this.fmp.nasdaq())
      .concat(await this.fmp.sp500());
    return this.prepared(result);
  }
  public async getAll(): Promise<string[]> {
    const symbols: string[] = (await this.getIndexedCompanies())
      .concat(this.getETFs())
      .concat(await this.getETFHolders());
    return symbols;
  }
  private get ignoreList(): string[] {
    return this._ignoreList;
  }
  private set ignoreList(value: string[]) {
    this._ignoreList = value;
  }
  public get fmp(): FmpService {
    return this._fmp;
  }
  public set fmp(value: FmpService) {
    this._fmp = value;
  }
}
