import { Advice as AdviceService } from '../../../src/application/service/advice.service';
import { BaseStocks as BaseStocksService } from '../../../src/application/service/baseStocks.service';
import { Period as PeriodModel } from '../../../src/domain/model/period.model';
import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';
import { BaseStocks as BaseStocksFakeService } from './baseStocks.mock.service';

describe('Class Advice Service', () => {
  it('getMomentumInvesting - Happy Path 01', async () => {
    const advice = new AdviceService(
      new BaseStocksService(ConfigurationUtil.FmpApiKey()),
      ConfigurationUtil.FmpApiKey()
    );
    const defSubperiods = [
      PeriodModel.OneDayDaily,
      PeriodModel.TwoDaysDaily,
      PeriodModel.ThreeDaysDaily,
      PeriodModel.FiveDaysDaily,
      PeriodModel.FiveDaysWeekly,
      PeriodModel.OneWeekWeekly,
      PeriodModel.FourWeeksWeekly,
      PeriodModel.OneMonthMonthly,
      PeriodModel.TwoMonthsMonthly,
      PeriodModel.ThreeMonthsMonthly,
      PeriodModel.FourMonthsMonthly,
      PeriodModel.SixMonthsMonthly,
      PeriodModel.TwelveMonthsMonthly,
      PeriodModel.OneYearYearly
    ];
    let result = await advice.getMomentumInvesting(defSubperiods[0].subperiods);
    for (
      let i = 1;
      i < defSubperiods.length &&
      (Array.isArray(result.stocks) === false || result.stocks.length === 0);
      i++
    ) {
      result = await advice.getMomentumInvesting(defSubperiods[i].subperiods);
    }
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 02', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting();
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 03', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.OneWeekWeekly.subperiods,
      {
        maxStocks: undefined,
        maxSameSector: undefined,
        maxSameIndustry: undefined,
        maxSameType: undefined,
        rateUSD: undefined,
        amountUsdToInvest: undefined,
        amountLocalToInvest: undefined,
        ignoreList: undefined,
        date: undefined,
        justCompanies: false,
        justETFs: false,
        justFounds: false
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 04', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.OneWeekWeekly.subperiods,
      {
        maxStocks: 5,
        maxSameSector: 3,
        maxSameIndustry: 2,
        maxSameType: 4,
        rateUSD: 700,
        amountUsdToInvest: 1000,
        amountLocalToInvest: 700000,
        ignoreList: undefined,
        date: undefined,
        justCompanies: false,
        justETFs: false,
        justFounds: false
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 05', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.OneWeekWeekly.subperiods,
      {
        maxStocks: 5,
        maxSameSector: 10,
        maxSameIndustry: 10,
        maxSameType: 10,
        rateUSD: 700,
        amountUsdToInvest: 1000,
        amountLocalToInvest: 700000,
        ignoreList: undefined,
        date: undefined,
        justCompanies: false,
        justETFs: false,
        justFounds: false
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 06', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: 700,
      amountUsdToInvest: 1000,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 07', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: undefined,
      maxSameSector: undefined,
      maxSameIndustry: undefined,
      rateUSD: undefined,
      maxSameType: undefined,
      amountUsdToInvest: undefined,
      amountLocalToInvest: undefined,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 08', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: 700,
      amountUsdToInvest: 1000,
      amountLocalToInvest: undefined,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 09', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: 700,
      amountUsdToInvest: undefined,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 10', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: undefined,
      amountUsdToInvest: 1000,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 11', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: undefined,
      amountUsdToInvest: 1000,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: true,
      justETFs: false,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 12', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: undefined,
      amountUsdToInvest: 1000,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: true,
      justFounds: false
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 13', async () => {
    const advice = new AdviceService(
      new BaseStocksFakeService(),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(undefined, {
      maxStocks: 5,
      maxSameSector: 10,
      maxSameIndustry: 10,
      maxSameType: 10,
      rateUSD: undefined,
      amountUsdToInvest: 1000,
      amountLocalToInvest: 700000,
      ignoreList: undefined,
      date: undefined,
      justCompanies: false,
      justETFs: false,
      justFounds: true
    });
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 14', async () => {
    const advice = new AdviceService(
      new BaseStocksService(ConfigurationUtil.FmpApiKey()),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.FourWeeksWeekly.subperiods,
      {
        maxStocks: 5,
        maxSameSector: 5,
        maxSameIndustry: 5,
        maxSameType: 5,
        rateUSD: 1,
        amountUsdToInvest: 1000,
        amountLocalToInvest: 1000,
        ignoreList: ['AAPL'],
        date: new Date('2020-01-01'),
        justCompanies: undefined,
        justETFs: undefined,
        justFounds: undefined
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 15', async () => {
    const advice = new AdviceService(
      new BaseStocksService(ConfigurationUtil.FmpApiKey()),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.FourWeeksWeekly.subperiods,
      {
        maxStocks: 5,
        maxSameSector: 5,
        maxSameIndustry: 5,
        maxSameType: 5,
        rateUSD: undefined,
        amountUsdToInvest: 1000,
        amountLocalToInvest: undefined,
        ignoreList: ['AAPL'],
        date: new Date('2020-01-01'),
        justCompanies: undefined,
        justETFs: undefined,
        justFounds: undefined
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Happy Path 16', async () => {
    const advice = new AdviceService(
      new BaseStocksService(ConfigurationUtil.FmpApiKey()),
      ConfigurationUtil.FmpApiKey()
    );
    const result = await advice.getMomentumInvesting(
      PeriodModel.FourWeeksWeekly.subperiods,
      {
        maxStocks: 5,
        maxSameSector: 5,
        maxSameIndustry: 5,
        maxSameType: 5,
        rateUSD: undefined,
        amountUsdToInvest: 1000,
        amountLocalToInvest: undefined,
        ignoreList: ['AAPL'],
        date: new Date(),
        justCompanies: undefined,
        justETFs: undefined,
        justFounds: undefined
      }
    );
    expect(Array.isArray(result.stocks)).toBeTruthy();
    expect(result.stocks.length).toBeGreaterThanOrEqual(0);
  }, 100000);
  it('getMomentumInvesting - Invalid amountLocalToInvest', async () => {
    let errorMsg = '';
    try {
      const advice = new AdviceService(
        new BaseStocksFakeService(),
        ConfigurationUtil.FmpApiKey()
      );
      await advice.getMomentumInvesting(undefined, {
        maxStocks: 5,
        maxSameSector: 10,
        maxSameIndustry: 10,
        maxSameType: 10,
        rateUSD: 700,
        amountUsdToInvest: 1000,
        amountLocalToInvest: 1000000,
        ignoreList: undefined,
        date: undefined,
        justCompanies: false,
        justETFs: false,
        justFounds: false
      });
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe('Invalid amountLocalToInvest');
  }, 100000);
});
