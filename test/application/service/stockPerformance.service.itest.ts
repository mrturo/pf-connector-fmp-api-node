import { StockPerformance as StockPerformanceService } from '../../../src/application/service/stockPerformance.service';
import { Period as PeriodModel } from '../../../src/domain/model/period.model';
import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';

describe('Class StockPerformance Service', () => {
  it('getInfo - Happy Path 1 - One subPeriod', async () => {
    const stockPerformance: StockPerformanceService =
      new StockPerformanceService(ConfigurationUtil.FmpApiKey());
    const companyInfo = await stockPerformance.getInfo(['AAPL']);
    expect(Array.isArray(companyInfo)).toBeTruthy();
    expect(companyInfo.length).toBe(1);
  }, 500000);
  it('getInfo - Happy Path 2 - One subPeriod', async () => {
    const stockPerformance: StockPerformanceService =
      new StockPerformanceService(ConfigurationUtil.FmpApiKey());
    const companyInfo = await stockPerformance.getInfo(['VOO']);
    expect(Array.isArray(companyInfo)).toBeTruthy();
    expect(companyInfo.length).toBe(1);
  }, 500000);
  it('getInfo - Happy Path 3 - One subPeriod', async () => {
    const stockPerformance: StockPerformanceService =
      new StockPerformanceService(ConfigurationUtil.FmpApiKey());
    const companyInfo = await stockPerformance.getInfo(['VTSAX']);
    expect(Array.isArray(companyInfo)).toBeTruthy();
    expect(companyInfo.length).toBe(1);
  }, 500000);
  it('getInfo - Happy Path 4 - Four subPeriods', async () => {
    const stockPerformance: StockPerformanceService =
      new StockPerformanceService(ConfigurationUtil.FmpApiKey());
    const companyInfo = await stockPerformance.getInfo(
      ['META'],
      undefined,
      [],
      PeriodModel.FourWeeksWeekly.subperiods
    );
    expect(Array.isArray(companyInfo)).toBeTruthy();
    expect(companyInfo.length).toBe(1);
  }, 500000);
});
