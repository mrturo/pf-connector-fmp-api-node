import { Advice as AdviceUtil } from '../../../src/application/util/advice.util';
import { Stock as StockUtil } from '../../../src/domain/model/stock.model';

describe('Class Advice Util', () => {
  it('SortByPerformance - HappyPath', async () => {
    expect(
      AdviceUtil.SortByPerformance([
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5
          }
        },
        {
          performance: {
            price: 6,
            diff: 7,
            percentage: 8,
            avgPct: 9,
            avgChg: 10
          }
        }
      ])
    ).toEqual([
      {
        performance: { avgChg: 10, avgPct: 9, diff: 7, percentage: 8, price: 6 }
      },
      {
        performance: { avgChg: 5, avgPct: 4, diff: 2, percentage: 3, price: 1 }
      }
    ]);
  });
  it('FilterByPerformance - HappyPath', async () => {
    expect(
      AdviceUtil.FilterByPerformance([
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5,
            subPeriods: [
              {
                percentage: 6
              },
              {
                percentage: 7
              },
              {
                percentage: -8
              }
            ]
          }
        },
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5,
            subPeriods: [
              {
                percentage: -6
              },
              {
                percentage: 7
              },
              {
                percentage: 8
              }
            ]
          }
        },
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5,
            subPeriods: [
              {
                percentage: 6
              },
              {
                percentage: 7
              },
              {
                percentage: 8
              }
            ]
          }
        },
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5,
            subPeriods: [
              {
                percentage: -6
              }
            ]
          }
        },
        {
          performance: {
            price: 1,
            diff: 2,
            percentage: 3,
            avgPct: 4,
            avgChg: 5,
            subPeriods: [
              {
                percentage: 6
              }
            ]
          }
        }
      ])
    ).toEqual([
      {
        performance: {
          avgChg: 5,
          avgPct: 4,
          diff: 2,
          percentage: 3,
          price: 1,
          subPeriods: [
            {
              percentage: 6
            },
            {
              percentage: 7
            },
            {
              percentage: -8
            }
          ]
        }
      },
      {
        performance: {
          avgChg: 5,
          avgPct: 4,
          diff: 2,
          percentage: 3,
          price: 1,
          subPeriods: [
            {
              percentage: -6
            },
            {
              percentage: 7
            },
            {
              percentage: 8
            }
          ]
        }
      },
      {
        performance: {
          avgChg: 5,
          avgPct: 4,
          diff: 2,
          percentage: 3,
          price: 1,
          subPeriods: [
            {
              percentage: 6
            },
            {
              percentage: 7
            },
            {
              percentage: 8
            }
          ]
        }
      },
      {
        performance: {
          avgChg: 5,
          avgPct: 4,
          diff: 2,
          percentage: 3,
          price: 1,
          subPeriods: [
            {
              percentage: -6
            }
          ]
        }
      },
      {
        performance: {
          avgChg: 5,
          avgPct: 4,
          diff: 2,
          percentage: 3,
          price: 1,
          subPeriods: [
            {
              percentage: 6
            }
          ]
        }
      }
    ]);
  });
  it('FilterByStockTypes - HappyPath 1', async () => {
    expect(
      AdviceUtil.FilterByStockTypes(
        [
          {},
          {
            sector: '1',
            industry: '2',
            type: StockUtil.Type.COMPANY
          },
          {
            sector: '3',
            industry: '4',
            type: '5'
          },
          {
            industry: '6',
            sector: '7',
            type: StockUtil.Type.COMPANY
          }
        ],
        4,
        2,
        2,
        2,
        false,
        false,
        false
      )
    ).toEqual([
      {},
      {
        industry: '2',
        sector: '1',
        type: StockUtil.Type.COMPANY
      },
      {
        industry: '4',
        sector: '3',
        type: '5'
      },
      {
        industry: '6',
        sector: '7',
        type: StockUtil.Type.COMPANY
      }
    ]);
  });
  it('FilterByStockTypes - HappyPath 2', async () => {
    expect(
      AdviceUtil.FilterByStockTypes(
        [
          {},
          {
            sector: '1',
            industry: '2',
            type: StockUtil.Type.COMPANY
          },
          {
            sector: '1',
            industry: '2',
            type: '3'
          }
        ],
        3,
        3,
        3,
        3,
        true,
        false,
        false
      )
    ).toEqual([
      {
        industry: '2',
        sector: '1',
        type: StockUtil.Type.COMPANY
      }
    ]);
  });
  it('FilterByStockTypes - HappyPath 3', async () => {
    expect(
      AdviceUtil.FilterByStockTypes(
        [
          {},
          {
            sector: '1',
            industry: '2',
            type: StockUtil.Type.ETF
          },
          {
            sector: '1',
            industry: '2',
            type: '3'
          }
        ],
        3,
        3,
        3,
        3,
        false,
        true,
        false
      )
    ).toEqual([
      {
        industry: '2',
        sector: '1',
        type: StockUtil.Type.ETF
      }
    ]);
  });
  it('FilterByStockTypes - HappyPath 4', async () => {
    expect(
      AdviceUtil.FilterByStockTypes(
        [
          {},
          {
            sector: '1',
            industry: '2',
            type: StockUtil.Type.MUTUAL_FUND
          },
          {
            sector: '1',
            industry: '2',
            type: '3'
          }
        ],
        3,
        3,
        3,
        3,
        false,
        false,
        true
      )
    ).toEqual([
      {
        industry: '2',
        sector: '1',
        type: StockUtil.Type.MUTUAL_FUND
      }
    ]);
  });
  it('FilterByStockTypes - Error', async () => {
    let errorMsg = '';
    try {
      AdviceUtil.FilterByStockTypes(
        [
          {},
          {
            sector: '1',
            industry: '2',
            type: StockUtil.Type.MUTUAL_FUND
          },
          {
            sector: '1',
            industry: '2',
            type: '3'
          }
        ],
        3,
        3,
        3,
        3,
        true,
        true,
        true
      );
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe(
      'You can only choose one type of \'just\' stock to advice: {"justCompanies":true,"justETFs":true,"justFounds":true}})}'
    );
  });
  it('BuildPerformanceInfo - HappyPath 1', async () => {
    expect(
      AdviceUtil.BuildPerformanceInfo(
        [
          {
            performance: {
              avgChg: 1
            }
          }
        ],
        1,
        1
      )
    ).toEqual([
      {
        advice: {
          amountLocal: 1,
          amountUSD: 1,
          percentage: 100
        },
        performance: {
          avgChg: 1
        }
      }
    ]);
  });
  it('BuildPerformanceInfo - HappyPath 2', async () => {
    expect(
      AdviceUtil.BuildPerformanceInfo([
        {
          performance: {
            avgChg: 1
          }
        }
      ])
    ).toEqual([
      {
        advice: {
          percentage: 100
        },
        performance: {
          avgChg: 1
        }
      }
    ]);
  });
});
