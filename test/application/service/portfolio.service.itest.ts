import { Portfolio as PortfolioService } from '../../../src/application/service/portfolio.service';
import { Portfolio as PortfolioModel } from '../../../src/domain/model/portfolio.model';
import { Stock as StockModel } from '../../../src/domain/model/stock.model';
import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';

describe('Class Portfolio Service', () => {
  it('update - Happy Path', async () => {
    const stocks: Map<string, StockModel> = new Map<string, StockModel>();
    stocks.set('AAPL', new StockModel('AAPL'));
    stocks.set('VOO', new StockModel('VOO'));
    stocks.set('VFIAX', new StockModel('VFIAX'));
    const service: PortfolioService = new PortfolioService(
      ConfigurationUtil.FmpApiKey()
    );
    const portfolio: PortfolioModel = await service.update(
      new PortfolioModel(stocks)
    );
    const json = portfolio
      .json()
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
    expect(json.length).toBe(3);
    expect(json[0].symbol).toBe('AAPL');
    expect(json[0].name).toBe('APPLE INC.');
    expect(json[0].type).toBe('COMPANY');
    expect(json[0].sector).toBe('TECHNOLOGY');
    expect(json[0].industry).toBe('CONSUMER ELECTRONICS');
    expect(json[0].unitPriceUSD).not.toBe(1);
    expect(json[1].symbol).toBe('VFIAX');
    expect(json[1].name).toBe('VANGUARD 500 INDEX FD ADMIRAL SHS');
    expect(json[1].type).toBe('MUTUAL_FUND');
    expect(json[1].sector).toBe('MUTUAL_FUND');
    expect(json[1].industry).toBe('MUTUAL_FUND');
    expect(json[1].unitPriceUSD).not.toBe(1);
    expect(json[2].symbol).toBe('VOO');
    expect(json[2].name).toBe('VANGUARD 500 INDEX FUND');
    expect(json[2].type).toBe('ETF');
    expect(json[2].sector).toBe('ETF');
    expect(json[2].industry).toBe('ETF');
    expect(json[2].unitPriceUSD).not.toBe(1);
  }, 50000);
  it('getExtended - Happy Path 1', async () => {
    const stocks: Map<string, StockModel> = new Map<string, StockModel>();
    stocks.set('VOO', new StockModel('VOO', 1.001552));
    stocks.set('VIG', new StockModel('VIG', 2.095175));
    stocks.set('VUG', new StockModel('VUG', 1.283064));
    stocks.set('VYM', new StockModel('VYM', 2.003419));
    stocks.set('AMZN', new StockModel('AMZN', 1.138948));
    stocks.set('VXUS', new StockModel('VXUS', 2.001203));
    const service: PortfolioService = new PortfolioService(
      ConfigurationUtil.FmpApiKey()
    );
    const portfolio: PortfolioModel = await service.update(
      new PortfolioModel(stocks)
    );
    const extendedPortfolio: PortfolioModel = await service.getExtended(
      portfolio,
      3
    );
    expect(portfolio.json().length).toBeLessThan(
      extendedPortfolio.json().length
    );
  }, 75000);
  it('getExtended - Happy Path 2', async () => {
    const stocks: Map<string, StockModel> = new Map<string, StockModel>();
    stocks.set('AMZN', new StockModel('AMZN', 1.138948));
    const service: PortfolioService = new PortfolioService(
      ConfigurationUtil.FmpApiKey()
    );
    const portfolio: PortfolioModel = await service.update(
      new PortfolioModel(stocks)
    );
    const extendedPortfolio: PortfolioModel = await service.getExtended(
      portfolio
    );
    const preAMZN = portfolio.stocks.get('AMZN') || new StockModel('AMZN');
    const postAMZN =
      extendedPortfolio.stocks.get('AMZN') || new StockModel('AMZN');
    expect(portfolio.json().length).toBeLessThanOrEqual(
      extendedPortfolio.json().length
    );
    expect(preAMZN.quantity).toBeLessThanOrEqual(postAMZN.quantity);
  }, 100000);
});
