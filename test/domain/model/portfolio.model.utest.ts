import { Portfolio as PortfolioModel } from '../../../src/domain/model/portfolio.model';
import { Stock as StockModel } from '../../../src/domain/model/stock.model';

describe('Class Portfolio Model', () => {
  it('Happy Path 1', async () => {
    const portfolio: PortfolioModel = new PortfolioModel();
    expect(portfolio.symbols).toEqual([]);
  });
  it('Happy Path 2', async () => {
    const stocks: Map<string, StockModel> = new Map<string, StockModel>();
    const aStock = new StockModel('A');
    aStock.sector = 'a';
    aStock.industry = '1';
    stocks.set('A', aStock);
    const bStock = new StockModel('B');
    bStock.sector = 'a';
    bStock.industry = '2';
    stocks.set('B', bStock);
    const cStock = new StockModel('C');
    cStock.sector = 'a';
    cStock.industry = '3';
    stocks.set('C', cStock);
    const dStock = new StockModel('D');
    dStock.sector = 'b';
    dStock.industry = '1';
    stocks.set('D', dStock);
    const eStock = new StockModel('E');
    eStock.sector = 'b';
    eStock.industry = '2';
    stocks.set('E', eStock);
    const fStock = new StockModel('F');
    fStock.sector = 'b';
    fStock.industry = '3';
    stocks.set('F', fStock);
    const gStock = new StockModel('G');
    gStock.sector = 'c';
    gStock.industry = '1';
    stocks.set('G', gStock);
    const hStock = new StockModel('H');
    hStock.sector = 'c';
    hStock.industry = '2';
    stocks.set('H', hStock);
    const iStock = new StockModel('I');
    iStock.sector = 'c';
    iStock.industry = '3';
    stocks.set('I', iStock);
    const jStock = new StockModel('J');
    jStock.sector = 'c';
    jStock.industry = '3';
    stocks.set('J', jStock);
    const kStock = new StockModel('K');
    stocks.set('K', kStock);
    const portfolio: PortfolioModel = new PortfolioModel(stocks);
    expect(portfolio.symbols).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K'
    ]);
    expect(portfolio.amountUSD).toBeGreaterThanOrEqual(0);
    expect(portfolio.amountLocal(1)).toBe(11);
    expect(portfolio.amountLocal()).toBeUndefined();
    expect(portfolio.percentage(portfolio.amountUSD)).toBe(100);
    expect(
      portfolio.json().sort((a, b) => a.symbol.localeCompare(b.symbol))
    ).toEqual([
      {
        symbol: 'A',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '1',
        percentage: 9.09,
        sector: 'A'
      },
      {
        symbol: 'B',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '2',
        percentage: 9.09,
        sector: 'A'
      },
      {
        symbol: 'C',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '3',
        percentage: 9.09,
        sector: 'A'
      },
      {
        symbol: 'D',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '1',
        percentage: 9.09,
        sector: 'B'
      },
      {
        symbol: 'E',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '2',
        percentage: 9.09,
        sector: 'B'
      },
      {
        symbol: 'F',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '3',
        percentage: 9.09,
        sector: 'B'
      },
      {
        symbol: 'G',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '1',
        percentage: 9.09,
        sector: 'C'
      },
      {
        symbol: 'H',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '2',
        percentage: 9.09,
        sector: 'C'
      },
      {
        symbol: 'I',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '3',
        percentage: 9.09,
        sector: 'C'
      },
      {
        symbol: 'J',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: '3',
        percentage: 9.09,
        sector: 'C'
      },
      {
        symbol: 'K',
        name: undefined,
        type: 'COMPANY',
        quantity: 1,
        unitPriceUSD: 1,
        amountUSD: 1,
        amountLocal: undefined,
        industry: 'COMPANY',
        percentage: 9.09,
        sector: 'COMPANY'
      }
    ]);
    expect(portfolio.stocksBySector().length).toBeGreaterThanOrEqual(0);
    expect(portfolio.stocksByIndustry().length).toBeGreaterThanOrEqual(0);
  });
});
