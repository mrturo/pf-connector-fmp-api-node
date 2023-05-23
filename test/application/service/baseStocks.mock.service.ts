import { BaseStocks as BaseStocksInterface } from '../../../src/application/service/baseStocks.service.interface';

export class BaseStocks implements BaseStocksInterface {
  public async getAll(): Promise<string[]> {
    return ['AAPL', 'META', 'MSFT', 'AMZN', 'VOO'];
  }
}
