import { Portfolio as PortfolioModel } from '../../domain/model/portfolio.model';
import { Stock as StockModel } from '../../domain/model/stock.model';
import { FMP as FmpService } from '../../infrastructure/service/fmp.service';

export class Portfolio {
  public static async update(
    fmpApiKey: string,
    portfolio: PortfolioModel
  ): Promise<PortfolioModel> {
    const stocks: Map<string, StockModel> = portfolio.stocks;
    const symbols: string[] = portfolio.symbols;
    const fmp = new FmpService(undefined, fmpApiKey);
    const profiles = await fmp.profile(symbols);
    for (const p of profiles) {
      const stock: StockModel | undefined = stocks.get(p.symbol);
      if (stock) {
        stock.unitPriceUSD = p.price;
        stock.name = p.companyName;
        stock.industry = p.industry;
        stock.sector = p.sector;
        stock.type =
          p.isEtf === true
            ? StockModel.type.ETF
            : p.isFund === true
            ? StockModel.type.MUTUAL_FUND
            : StockModel.type.COMPANY;
        stocks.set(stock.symbol, stock);
      }
    }
    portfolio.stocks = stocks;
    return portfolio;
  }
  public static async createBySymbols(
    fmpApiKey: string,
    symbols: string[]
  ): Promise<PortfolioModel> {
    const stockMap: Map<string, StockModel> = new Map<string, StockModel>();
    for (const s of symbols) {
      if (s.trim().length > 0) {
        stockMap.set(s, new StockModel(s));
      }
    }
    return new PortfolioModel(
      (await Portfolio.update(fmpApiKey, new PortfolioModel(stockMap))).stocks
    );
  }
  public static async getExtended(
    fmpApiKey: string,
    portfolio: PortfolioModel,
    maxIterations = 1
  ): Promise<PortfolioModel> {
    let toAnalyze = new PortfolioModel(portfolio.stocks);
    if (portfolio.stocks.size > 0) {
      for (let i = 0; i < maxIterations; i++) {
        const etfStocks: StockModel[] = Array.from(
          toAnalyze.stocks.values()
        ).filter((stock) => {
          return stock.type === StockModel.type.ETF;
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
            return stock.type !== StockModel.type.ETF;
          });
          for (const noEtf of notEtfSymbols) {
            allStocks.set(noEtf.symbol, {
              amountUSD: noEtf.quantity * noEtf.unitPriceUSD
            });
          }
          const fmp = new FmpService(undefined, fmpApiKey);
          for (const etf of await fmp.etfHolder(
            etfStocks.map((s) => s.symbol)
          )) {
            const etfStock: StockModel = Array.from(
              toAnalyze.stocks.values()
            ).filter((stock) => {
              return (
                stock.type === StockModel.type.ETF &&
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
            await Portfolio.createBySymbols(fmpApiKey, allStocksKeys)
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
        otherStock.type = StockModel.type.UNKNOWN;
        temp.set(otherStock.symbol, otherStock);
        toAnalyze.stocks = temp;
      }
    }
    return toAnalyze;
  }
}
