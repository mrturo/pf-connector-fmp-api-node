import { round } from 'mathjs';
import { Stock as StockModel } from './stock.model';

export class Portfolio {
  private _stocks!: Map<string, StockModel>;
  constructor(stocks: Map<string, StockModel> = new Map<string, StockModel>()) {
    this.stocks = stocks;
  }
  public amountLocal(
    rateUSD: number | undefined = undefined
  ): number | undefined {
    return rateUSD ? round(rateUSD * this.amountUSD, 0) : undefined;
  }
  public get amountUSD(): number {
    return Array.from(this.stocks.values()).reduce(
      (accumulator: number, stock: StockModel) => {
        return accumulator + stock.amountUSD;
      },
      0
    );
  }
  public json(rateUSD: number | undefined = undefined): any[] {
    const result: any[] = [];
    for (const s of this.symbols) {
      const stock: StockModel | undefined = this.stocks.get(s);
      if (stock) {
        result.push(stock.json(rateUSD, this.amountUSD));
      }
    }
    return result.sort((a: any, b: any) => b.amountUSD - a.amountUSD);
  }
  public percentage(
    totalAmountUSD: number | undefined = undefined
  ): number | undefined {
    let result: number | undefined = undefined;
    if (totalAmountUSD) {
      result = round((this.amountUSD / totalAmountUSD) * 100, 2);
    }
    return result;
  }
  public get stocks(): Map<string, StockModel> {
    return this._stocks;
  }
  public set stocks(value: Map<string, StockModel>) {
    this._stocks = value;
  }
  public stocksBySector(
    rateUSD: number | undefined = undefined,
    totalAmountUSD: number | undefined = undefined
  ): {
    name: string;
    amountUSD: number;
    amountLocal: number | undefined;
    percentage: number | undefined;
    stocks: any[];
    byIndustry: any[];
  }[] {
    const allStocks = Array.from(this._stocks.values());
    const sectors = [
      ...new Set(allStocks.map((a) => (a.sector || '').trim()))
    ].sort();
    const result: {
      name: string;
      amountUSD: number;
      amountLocal: number | undefined;
      percentage: number | undefined;
      stocks: any[];
      byIndustry: any[];
    }[] = [];
    for (const sector of sectors) {
      const localSector = allStocks.filter((stock) => {
        return stock.sector === sector;
      });
      const nameSector = sector === '' ? 'Unknown' : sector;
      const localSectorPortfolio = new Portfolio(
        new Map(localSector.map((stock) => [stock.symbol, stock]))
      );
      const industries = [
        ...new Set(
          Array.from(localSectorPortfolio.stocks.values()).map(
            (a) => a.industry
          )
        )
      ].sort();
      const resultIndustries = [];
      for (const industry of industries) {
        const localIndustry = Array.from(
          localSectorPortfolio.stocks.values()
        ).filter((stock) => {
          return stock.industry === industry;
        });
        const localIndustryPortfolio = new Portfolio(
          new Map(localIndustry.map((stock) => [stock.symbol, stock]))
        );
        if (localIndustryPortfolio.amountUSD > 0) {
          const stocks = localIndustryPortfolio
            .json(rateUSD)
            .sort((a: any, b: any) => b.amountUSD - a.amountUSD);
          resultIndustries.push({
            name: industry,
            amountUSD: round(localIndustryPortfolio.amountUSD, 2),
            amountLocal: localIndustryPortfolio.amountLocal(rateUSD),
            percentage: localIndustryPortfolio.percentage(totalAmountUSD),
            stocks: stocks
          });
        }
      }
      const stocks = localSectorPortfolio
        .json(rateUSD)
        .sort((a: any, b: any) => b.amountUSD - a.amountUSD);
      if (localSectorPortfolio.amountUSD > 0) {
        result.push({
          name: nameSector,
          amountUSD: round(localSectorPortfolio.amountUSD, 2),
          amountLocal: localSectorPortfolio.amountLocal(rateUSD),
          percentage: localSectorPortfolio.percentage(totalAmountUSD),
          stocks: stocks,
          byIndustry: resultIndustries.sort(
            (a: any, b: any) => b.amountUSD - a.amountUSD
          )
        });
      }
    }
    return result.sort((a: any, b: any) => b.amountUSD - a.amountUSD);
  }
  public stocksByIndustry(
    rateUSD: number | undefined = undefined,
    totalAmountUSD: number | undefined = undefined
  ): {
    name: string;
    amountUSD: number;
    amountLocal: number | undefined;
    percentage: number | undefined;
    stocks: any[];
  }[] {
    const allStocks = Array.from(this._stocks.values());
    const industries = [
      ...new Set(allStocks.map((a) => (a.industry || '').trim()))
    ].sort();
    const result: {
      name: string;
      sector: string;
      amountUSD: number;
      amountLocal: number | undefined;
      percentage: number | undefined;
      stocks: any[];
    }[] = [];
    for (const industry of industries) {
      const localIndustry = allStocks.filter((stock) => {
        return stock.industry === industry;
      });
      const nameIndustry = industry === '' ? 'Unknown' : industry;
      const localPortfolio = new Portfolio(
        new Map(localIndustry.map((stock) => [stock.symbol, stock]))
      );
      if (localPortfolio.amountUSD > 0) {
        const localStock = localPortfolio
          .json(rateUSD)
          .sort((a: any, b: any) => b.amountUSD - a.amountUSD);
        result.push({
          name: nameIndustry,
          sector: localStock[0].sector,
          amountUSD: round(localPortfolio.amountUSD, 2),
          amountLocal: localPortfolio.amountLocal(rateUSD),
          percentage: localPortfolio.percentage(totalAmountUSD),
          stocks: localStock
        });
      }
    }
    return result.sort((a: any, b: any) => b.amountUSD - a.amountUSD);
  }
  public get symbols(): string[] {
    return Array.from(this.stocks.keys());
  }
}
