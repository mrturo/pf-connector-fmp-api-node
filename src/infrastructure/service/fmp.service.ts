import retry from 'async-retry';
import * as fs from 'fs-extra';
import { Backup as BackupService } from '../../application/service/backup.service';
import { Symbol as SymbolUtil } from '../../application/util/symbol.util';
import { Configuration as ConfigurationUtil } from '../../domain/util/configuration.util';
import { Constants as ConstantsUtil } from '../../domain/util/constants.util';
import { Logger as LoggerUtil } from '../../domain/util/logger.util';
import { StringUtil } from '../../domain/util/string.util';
import { Infrastructure as InfrastructureError } from '../error/infrastructure.error';
import { ApiRest as ApiRestInterface } from '../util/api-rest.interface.util';
import { ApiRest as ApiRestUtil } from '../util/api-rest.util';

export class FMP {
  private static MaxExecutions = 5;
  public static ValidApiKey(apiKey: string | undefined): boolean {
    if (!StringUtil.TrimAndCheckEmpty(apiKey)) {
      throw new InfrastructureError('FMP API KEY is not valid');
    }
    return true;
  }
  private _apiRestService!: ApiRestInterface;
  private _apiKey!: string;
  constructor(
    apiRestService: ApiRestInterface | undefined = undefined,
    apiKey: string = ConfigurationUtil.FmpApiKey()
  ) {
    this.apiRestService = apiRestService
      ? apiRestService
      : new ApiRestUtil('url');
    this.apiKey = apiKey.trim();
    FMP.ValidApiKey(this.apiKey);
  }
  public get apiRestService(): ApiRestInterface {
    return this._apiRestService;
  }
  public set apiRestService(value: ApiRestInterface) {
    this._apiRestService = value;
  }
  public get apiKey(): string {
    return this._apiKey;
  }
  public set apiKey(value: string) {
    this._apiKey = value;
  }
  public async exe(url: string): Promise<any> {
    this.apiRestService.url = url;
    return await retry(
      async () => {
        return await this.apiRestService.exe();
      },
      { retries: FMP.MaxExecutions }
    );
  }
  public async saveDate(url: string, path = ''): Promise<any> {
    path = path.trim();
    const result = await this.exe(url.trim());
    if (path !== '') {
      try {
        await BackupService.CreateFolderBase();
        await fs.promises.writeFile(
          path,
          JSON.stringify({
            date: new Date(),
            body: result
          })
        );
      } catch (error) {
        const pathLength = path.split('\\').length;
        const filename = path.split('\\')[pathLength - 1].split('.')[0];
        const shortFilename =
          filename.length > 100 ? `${filename.substring(0, 100)}..` : filename;
        const errorMsg = `${error}`;
        LoggerUtil.error(
          `Saving Data => ${errorMsg.replace(filename, shortFilename)}`
        );
      }
    }
    return result;
  }
  public async getData(
    url: string,
    path = '',
    forceUpdate = false,
    now = new Date()
  ): Promise<any> {
    let result: any = {};
    if (
      forceUpdate === true ||
      path.trim() === '' ||
      fs.existsSync(path.trim()) === false
    ) {
      result = await this.saveDate(url, path);
    } else {
      const bodyFile = JSON.parse(fs.readFileSync(path.trim(), 'utf8'));
      if (bodyFile.date && bodyFile.body) {
        const date = new Date(bodyFile.date);
        date.setDate(date.getDate() + BackupService.maxDays);
        if (date < now) {
          result = await this.saveDate(url, path);
        } else {
          result = bodyFile.body;
        }
      } else {
        result = await this.saveDate(url, path);
      }
    }
    return result;
  }
  public async etfHolder(symbol: string | string[]): Promise<any> {
    return (
      await Promise.all(
        SymbolUtil.GetSymbol(symbol).map(async (value) => {
          return {
            symbol: value,
            holders: await this.getData(
              `${ConstantsUtil.FMP_BASE_URL()}etf-holder/${value}?apikey=${
                this.apiKey
              }`,
              `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-etf-holder-${value}${
                BackupService.fileExtension
              }`
            )
          };
        })
      )
    ).sort((a, b) => a.symbol.localeCompare(b.symbol));
  }
  public async profile(symbol: string | string[]): Promise<any> {
    const allAvailableSymbols = (await this.availableTraded()).map(
      (a: any) => a.symbol
    );
    const localSymbol: string[] = SymbolUtil.GetSymbol(symbol).filter(
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
      const symbols = SymbolUtil.GetSymbolString(sub);
      result = result.concat(
        await this.getData(
          `${ConstantsUtil.FMP_BASE_URL()}profile/${symbols}?apikey=${
            this.apiKey
          }`,
          `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-profile-${symbols}${
            BackupService.fileExtension
          }`
        )
      );
    }
    return result.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async historicalPriceFull(symbol: string | string[]): Promise<any> {
    symbol = SymbolUtil.GetSymbol(symbol);
    BackupService.CreateFolderBase();
    BackupService.CleanOldData();
    const stocks: Map<string, { date: Date; data: any }> = new Map<
      string,
      { date: Date; data: any }
    >();
    const files = fs.readdirSync(ConstantsUtil.BACKUP_BASE_PATH());
    for (const file of files) {
      const prex = 'fmp-historical-price-full-';
      if (file.startsWith(prex) === true) {
        if (
          file
            .substring(prex.length, file.length - 5)
            .split(',')
            .filter((s) => {
              return symbol.includes(s) === true;
            }).length > 0
        ) {
          const bodyFile = JSON.parse(
            fs.readFileSync(
              `${ConstantsUtil.BACKUP_BASE_PATH()}${file.trim()}`,
              'utf8'
            )
          );
          if (bodyFile.body && bodyFile.date) {
            const historicalFile = (
              bodyFile.body.historicalStockList || [bodyFile.body]
            ).filter((h: any) => {
              return symbol.includes(h.symbol) === true;
            });
            for (const historical of historicalFile) {
              const mapped = stocks.get(historical.symbol);
              if (!mapped || mapped.date < new Date(bodyFile.date)) {
                stocks.set(historical.symbol, {
                  date: new Date(bodyFile.date),
                  data: historical
                });
              }
            }
          }
        }
      }
    }
    const result = Array.from(stocks.values()).map((s) => s.data);
    const resultSymbols = result.map((s) => s.symbol);
    symbol = symbol.filter((s: any) => {
      return resultSymbols.includes(s) === false;
    });
    const chunkedSymbols = SymbolUtil.ChunkSymbolString(symbol, 5);
    return result
      .concat(
        ...(await Promise.all(
          chunkedSymbols.map(async (chunked) => {
            const data = await this.getData(
              `${ConstantsUtil.FMP_BASE_URL()}historical-price-full/${chunked}?apikey=${
                this.apiKey
              }`,
              `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-historical-price-full-${chunked}${
                BackupService.fileExtension
              }`
            );
            let result = data.historicalStockList;
            if (!result) {
              result = data;
            }
            return result;
          })
        ))
      )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async availableTraded(): Promise<any> {
    return (
      await this.getData(
        `${ConstantsUtil.FMP_BASE_URL()}available-traded/list?apikey=${
          this.apiKey
        }`,
        `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-available-traded-list${
          BackupService.fileExtension
        }`
      )
    ).sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
  }
  public async sp500(): Promise<string[]> {
    return (
      await this.getData(
        `${ConstantsUtil.FMP_BASE_URL()}sp500_constituent?apikey=${
          this.apiKey
        }`,
        `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-sp500_constituent${
          BackupService.fileExtension
        }`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
  public async nasdaq(): Promise<string[]> {
    return (
      await this.getData(
        `${ConstantsUtil.FMP_BASE_URL()}nasdaq_constituent?apikey=${
          this.apiKey
        }`,
        `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-nasdaq_constituent${
          BackupService.fileExtension
        }`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
  public async dowJones(): Promise<string[]> {
    return (
      await this.getData(
        `${ConstantsUtil.FMP_BASE_URL()}dowjones_constituent?apikey=${
          this.apiKey
        }`,
        `${ConstantsUtil.BACKUP_BASE_PATH()}fmp-dowjones_constituent${
          BackupService.fileExtension
        }`
      )
    )
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))
      .map((a: any) => a.symbol);
  }
}
