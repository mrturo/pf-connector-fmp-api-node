import { BaseStocks as BaseStocksService } from '../../../src/application/service/baseStocks.service';
import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';

describe('Class BaseStocks Service', () => {
  it('getAll - Happy Path', async () => {
    const service = new BaseStocksService(ConfigurationUtil.FmpApiKey());
    const baseStocks = await service.getAll();
    expect(Array.isArray(baseStocks)).toBeTruthy();
    expect(typeof baseStocks[0]).toBe('string');
    expect(baseStocks.length).toBeGreaterThanOrEqual(1);
  }, 100000);
});
