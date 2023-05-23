import { Portfolio as PortfolioModel } from '../../domain/model/portfolio.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { FMP as FmpService } from '../../infrastructure/service/fmp.service';

export class Portfolio {
  private static maxIterations = 1;
  private _fmp!: FmpService;
  constructor(fmpApiKey: string) {
    this.fmp = new FmpService(undefined, fmpApiKey);
  }
  public async update(portfolio: PortfolioModel): Promise<PortfolioModel> {
    const stocks: Map<string, StockModel> = portfolio.stocks;
    const symbols: string[] = portfolio.symbols;
    const profiles = await this.fmp.profile(symbols);
    for (const p of profiles) {
      const stock: StockModel | undefined = stocks.get(p.symbol);
      if (stock) {
        stock.unitPriceUSD = p.price;
        stock.name = p.companyName;
        stock.industry = p.industry;
        stock.sector = p.sector;
        stock.type =
          p.isEtf === true
            ? StockModel.Type.ETF
            : p.isFund === true
            ? StockModel.Type.MUTUAL_FUND
            : StockModel.Type.COMPANY;
        stocks.set(stock.symbol, stock);
      }
    }
    portfolio.stocks = stocks;
    return portfolio;
  }
  private async createBySymbols(symbols: string[]): Promise<PortfolioModel> {
    const stockMap: Map<string, StockModel> = new Map<string, StockModel>();
    for (const s of symbols) {
      if (s.trim().length > 0) {
        stockMap.set(s, new StockModel(s));
      }
    }
    return new PortfolioModel(
      (await this.update(new PortfolioModel(stockMap))).stocks
    );
  }
  public async getExtended(
    portfolio: PortfolioModel,
    maxIterations = Portfolio.maxIterations
  ): Promise<PortfolioModel> {
    let toAnalyze = new PortfolioModel(portfolio.stocks);
    if (portfolio.stocks.size > 0) {
      for (let i = 0; i < maxIterations; i++) {
        const etfStocks: StockModel[] = Array.from(
          toAnalyze.stocks.values()
        ).filter((stock) => {
          return stock.type === StockModel.Type.ETF;
        });
        if (etfStocks.length <= 0) {
          i = maxIterations;
        } else {
          const allStocks: Map<string, { amountUSD: number }> = new Map<
            string,
            { amountUSD: number }
          >();
          const notEtfSymbols: StockModel[] = Array.from(
            toAnalyze.stocks.values()
          ).filter((stock) => {
            return stock.type !== StockModel.Type.ETF;
          });
          for (const noEtf of notEtfSymbols) {
            allStocks.set(noEtf.symbol, {
              amountUSD: noEtf.quantity * noEtf.unitPriceUSD
            });
          }
          for (const etf of await this.fmp.etfHolder(
            etfStocks.map((s) => s.symbol)
          )) {
            const etfStock: StockModel = Array.from(
              toAnalyze.stocks.values()
            ).filter((stock) => {
              return (
                stock.type === StockModel.Type.ETF &&
                stock.symbol === etf.symbol
              );
            })[0];
            const amountUSDEtfStock: number =
              etfStock.quantity * etfStock.unitPriceUSD;
            for (const holders of etf.holders) {
              const weightPercentage =
                (holders.weightPercentage || 0) === 0
                  ? 0
                  : holders.weightPercentage / 100;
              if (weightPercentage > 0) {
                const value = allStocks.get(holders.asset);
                const amountUSD =
                  (value ? value.amountUSD : 0) +
                  weightPercentage * amountUSDEtfStock;
                allStocks.set(holders.asset, {
                  amountUSD: amountUSD
                });
              }
            }
          }
          const allStocksKeys: string[] = Array.from(allStocks.keys());
          const resultStocks: Map<string, StockModel> = (
            await this.createBySymbols(allStocksKeys)
          ).stocks;
          for (const stockKey of allStocksKeys) {
            const stock = resultStocks.get(stockKey);
            if (stock) {
              stock.quantity = 0;
              const localStock = allStocks.get(stockKey);
              if (localStock) {
                stock.quantity = localStock.amountUSD / stock.unitPriceUSD;
              }
              resultStocks.set(stockKey, stock);
            }
          }
          toAnalyze = new PortfolioModel(resultStocks);
        }
      }
      const amountUSDDiff = portfolio.amountUSD - toAnalyze.amountUSD;
      if (amountUSDDiff > 0) {
        const temp = toAnalyze.stocks;
        const otherStock = new StockModel('OTHERS');
        otherStock.unitPriceUSD = amountUSDDiff;
        otherStock.type = StockModel.Type.UNKNOWN;
        temp.set(otherStock.symbol, otherStock);
        toAnalyze.stocks = temp;
      }
    }
    return toAnalyze;
  }
  public get fmp(): FmpService {
    return this._fmp;
  }
  public set fmp(value: FmpService) {
    this._fmp = value;
  }
}
