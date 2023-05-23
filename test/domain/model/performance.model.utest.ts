import { Candlestick as CandlestickModel } from '../../../src/domain/model/candlestick.model';
import { Performance as PerformanceModel } from '../../../src/domain/model/performance.model';
import { DateUtil } from '../../../src/domain/util/date.util';

describe('Class Performance Model', () => {
  it('Happy Path 1', async () => {
    const performance: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 10),
      678,
      16.9,
      3,
      0,
      2,
      0,
      0,
      undefined,
      new Date(2019, 5, 17)
    );
    expect(performance.json()).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      avgChg: 3,
      avgPct: 16.9,
      avgCandle: 3,
      change: 3,
      open: 0,
      close: 2,
      low: 0,
      high: 0,
      nextUpdate: new Date(2019, 5, 17),
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.GREEN,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: 1,
        type: CandlestickModel.Type.BULL,
        upperShadow: 0,
        value: 1
      }
    });
  });
  it('Happy Path 2', async () => {
    const performance: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 10),
      678,
      16.9,
      3,
      0,
      2,
      0,
      0
    );
    const p1: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 8),
      678,
      16.9,
      3,
      0,
      2,
      0,
      0
    );
    const p2: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 8),
      new Date(2019, 5, 10),
      678,
      16.9,
      3,
      0,
      2,
      0,
      0
    );
    expect(performance.json([p1, p2])).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      change: 3,
      avgCandle: 1,
      avgPct: 16.9,
      avgChg: 5.633333333333333,
      open: 0,
      close: 2,
      low: 0,
      high: 0,
      subPeriods: PerformanceModel.Json([p1, p2]),
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.GREEN,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: 1,
        type: CandlestickModel.Type.BULL,
        upperShadow: 0,
        value: 1
      }
    });
    expect(performance.json([p1])).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      change: 3,
      avgChg: 16.9,
      avgPct: 16.9,
      open: 0,
      close: 2,
      low: 0,
      high: 0,
      avgCandle: 1,
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.GREEN,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: 1,
        type: CandlestickModel.Type.BULL,
        upperShadow: 0,
        value: 1
      }
    });
  });
  it('Happy Path - buildFromHistory 1', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory(
        [
          {
            date: '2022-05-20T00:00:00.000Z',
            open: 178.92,
            close: 169.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-19T00:00:00.000Z',
            open: 178.92,
            close: 189.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-18T00:00:00.000Z',
            open: 178.92,
            close: 179.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-17T00:00:00.000Z',
            open: 182.35,
            close: 178.94,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-16T00:00:00.000Z',
            open: 182.87,
            close: 181.45,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-15T00:00:00.000Z',
            open: 183.6,
            close: 183.85,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-12T00:00:00.000Z',
            open: 184.38,
            close: 183.62,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-11T00:00:00.000Z',
            open: 185.84,
            close: 185.12,
            low: 0,
            high: 0
          }
        ],
        new Date('2022-05-18T00:00:00.000Z'),
        new Date('2022-05-11T00:00:00.000Z'),
        new Date('2022-05-20T00:00:00.000Z')
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      from: new Date('2022-05-11T00:00:00.000Z'),
      to: new Date('2022-05-18T00:00:00.000Z'),
      diff: -5.400000000000006,
      percentage: -2.928734136023433,
      change: 0,
      avgPct: -2.928734136023433,
      open: 184.38,
      close: 179.72,
      low: 0,
      high: 0,
      finalPerformance: {
        close: 189.72,
        date: '2022-05-19T00:00:00.000Z',
        percentage: 5.270925574530892
      },
      nextUpdate: new Date('2022-05-20T00:00:00.000Z'),
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.RED,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: -1,
        type: CandlestickModel.Type.BEAR,
        upperShadow: 0,
        value: -1
      }
    });
  });
  it('Happy Path - buildFromHistory 2', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory(
        [
          {
            date: DateUtil.Today(),
            open: 178.92,
            close: 169.72,
            low: 0,
            high: 0
          },
          {
            date: DateUtil.Yesterday(),
            open: 178.92,
            close: 109.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-20T00:00:00.000Z',
            open: 178.92,
            close: 169.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-19T00:00:00.000Z',
            open: 178.92,
            close: 189.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-18T00:00:00.000Z',
            open: 178.92,
            close: 179.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-17T00:00:00.000Z',
            open: 182.35,
            close: 178.94,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-16T00:00:00.000Z',
            open: 182.87,
            close: 181.45,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-15T00:00:00.000Z',
            open: 183.6,
            close: 183.85,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-12T00:00:00.000Z',
            open: 184.38,
            close: 183.62,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-11T00:00:00.000Z',
            open: 185.84,
            close: 185.12,
            low: 0,
            high: 0
          }
        ],
        new Date('2022-05-18T00:00:00.000Z'),
        new Date('2022-05-11T00:00:00.000Z'),
        DateUtil.Today()
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      from: new Date('2022-05-11T00:00:00.000Z'),
      to: new Date('2022-05-18T00:00:00.000Z'),
      diff: -5.400000000000006,
      percentage: -2.928734136023433,
      change: 0,
      avgPct: -2.928734136023433,
      open: 184.38,
      close: 179.72,
      low: 0,
      high: 0,
      finalPerformance: {
        close: 109.72,
        date: DateUtil.Yesterday(),
        percentage: -63.798760481224946
      },
      nextUpdate: DateUtil.Today(),
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.RED,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: -1,
        type: CandlestickModel.Type.BEAR,
        upperShadow: 0,
        value: -1
      }
    });
  });
  it('Happy Path - buildFromHistory 3', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory([
        {
          date: new Date('2022-05-18T00:00:00.000Z'),
          open: 178.92,
          close: 179.72,
          low: 0,
          high: 0
        },
        {
          date: new Date('2022-05-17T00:00:00.000Z'),
          open: 182.35,
          close: 178.94,
          low: 0,
          high: 0
        },
        {
          date: new Date('2022-05-16T00:00:00.000Z'),
          open: 182.87,
          close: 181.45,
          low: 0,
          high: 0
        },
        {
          date: new Date('2022-05-15T00:00:00.000Z'),
          open: 183.6,
          close: 183.85,
          low: 0,
          high: 0
        },
        {
          date: new Date('2022-05-12T00:00:00.000Z'),
          open: 184.38,
          close: 183.62,
          low: 0,
          high: 0
        },
        {
          date: new Date('2022-05-11T00:00:00.000Z'),
          open: 185.84,
          close: 185.12,
          low: 0,
          high: 0
        }
      ]);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      from: new Date('2022-05-10T00:00:00.000Z'),
      to: new Date('2022-05-17T00:00:00.000Z'),
      diff: -6.180000000000007,
      percentage: -3.351773511226818,
      change: 0,
      avgPct: -3.351773511226818,
      open: 184.38,
      close: 178.94,
      low: 0,
      high: 0,
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.RED,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: -1,
        type: CandlestickModel.Type.BEAR,
        upperShadow: 0,
        value: -1
      }
    });
  });
  it('Happy Path - buildFromHistory 4', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory(
        [
          {
            date: '2022-05-18T00:00:00.000Z',
            open: 178.92,
            close: 179.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-17T00:00:00.000Z',
            open: 182.35,
            close: 178.94,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-16T00:00:00.000Z',
            open: 182.87,
            close: 181.45,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-15T00:00:00.000Z',
            open: 183.6,
            close: 183.85,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-12T00:00:00.000Z',
            open: 184.38,
            close: 183.62,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-11T00:00:00.000Z',
            open: 185.84,
            close: 185.12,
            low: 0,
            high: 0
          }
        ],
        new Date('2022-05-18T00:00:00.000Z')
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      from: new Date('2022-05-16T00:00:00.000Z'),
      to: new Date('2022-05-17T00:00:00.000Z'),
      diff: -2.509999999999991,
      percentage: -1.3764738140937707,
      avgPct: -1.3764738140937707,
      change: 0,
      open: 182.35,
      close: 178.94,
      low: 0,
      high: 0,
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.RED,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: -1,
        type: CandlestickModel.Type.BEAR,
        upperShadow: 0,
        value: -1
      }
    });
  });
  it('Happy Path - buildFromHistory 5', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory(
        [
          {
            date: '2022-05-18T00:00:00.000Z',
            open: 178.92,
            close: 179.72,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-17T00:00:00.000Z',
            open: 182.35,
            close: 178.94,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-16T00:00:00.000Z',
            open: 182.87,
            close: 181.45,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-15T00:00:00.000Z',
            open: 183.6,
            close: 183.85,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-12T00:00:00.000Z',
            open: 184.38,
            close: 183.62,
            low: 0,
            high: 0
          },
          {
            date: '2022-05-11T00:00:00.000Z',
            open: 185.84,
            close: 185.12,
            low: 0,
            high: 0
          }
        ],
        undefined,
        new Date('2022-05-11T00:00:00.000Z')
      );
    if (performance) {
      expect(performance.json()).toEqual({
        from: new Date('2022-05-11T00:00:00.000Z'),
        to: new Date('2022-05-11T00:00:00.000Z'),
        diff: -0.7199999999999989,
        percentage: -0.3874300473525607,
        change: 0,
        avgPct: -0.3874300473525607,
        open: 185.84,
        close: 185.12,
        low: 0,
        high: 0
      });
    }
  });
  it('Happy Path - buildFromHistory 6', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory([]);
    expect(performance).toBeUndefined();
  });
  it('Happy Path - buildFromHistory 7', async () => {
    const today = DateUtil.Today();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    lastWeek.setHours(-(lastWeek.getTimezoneOffset() / 60));
    const nextWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7
    );
    nextWeek.setHours(-(nextWeek.getTimezoneOffset() / 60));
    const performance: PerformanceModel | undefined =
      PerformanceModel.BuildFromHistory(
        [
          {
            date: lastWeek.toISOString(),
            open: 178.92,
            close: 169.72,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 1
            ).toISOString(),
            open: 178.92,
            close: 189.72,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 2
            ).toISOString(),
            open: 178.92,
            close: 179.72,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 3
            ).toISOString(),
            open: 182.35,
            close: 178.94,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 4
            ).toISOString(),
            open: 182.87,
            close: 181.45,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 5
            ).toISOString(),
            open: 183.6,
            close: 183.85,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 6
            ).toISOString(),
            open: 184.38,
            close: 183.62,
            low: 0,
            high: 0
          },
          {
            date: new Date(
              lastWeek.getFullYear(),
              lastWeek.getMonth(),
              lastWeek.getDate() + 7
            ).toISOString(),
            open: 185.84,
            close: 185.12,
            low: 0,
            high: 0
          }
        ],
        lastWeek,
        today,
        nextWeek
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      from: lastWeek,
      to: today,
      diff: 15.400000000000006,
      percentage: 8.607198748043821,
      change: 0,
      avgPct: 8.607198748043821,
      open: 178.92,
      close: 185.12,
      low: 0,
      high: 0,
      nextUpdate: nextWeek,
      candlestick: {
        body: 0,
        bodyCenter: 0,
        color: CandlestickModel.Color.GREEN,
        isHammer: false,
        isHangingMan: false,
        lowerShadow: 0,
        numericType: 1,
        type: CandlestickModel.Type.BULL,
        upperShadow: 0,
        value: 1
      }
    });
  });
  it('Happy Path - Json array', async () => {
    const p1: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 3),
      new Date(2021, 3, 4),
      3,
      38,
      3,
      0,
      456,
      1,
      0
    );
    const p2: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      45,
      3,
      0,
      743,
      2,
      0
    );
    const p3: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      15,
      3,
      0,
      743,
      3,
      0
    );
    const p4: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      15,
      3,
      0,
      703,
      4,
      0
    );
    const p5: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      10,
      15,
      3,
      0,
      703,
      5,
      0
    );
    expect(PerformanceModel.Json([p4, p2, p5, p1, p3])).toEqual([
      {
        from: new Date('2021-04-05T04:00:00.000Z'),
        to: new Date('2021-04-06T04:00:00.000Z'),
        open: 0,
        close: 703,
        low: 4,
        high: 0,
        diff: 7,
        percentage: 15,
        change: 3,
        avgCandle: 3,
        avgPct: 15,
        avgChg: 3,
        candlestick: {
          body: 175.75,
          bodyCenter: 86.875,
          color: CandlestickModel.Color.GREEN,
          isEngulfing: false,
          isHammer: true,
          isHangingMan: false,
          isPiercingPattern: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -175.75,
          value: 173.75
        }
      },
      {
        from: new Date('2021-04-05T04:00:00.000Z'),
        to: new Date('2021-04-06T04:00:00.000Z'),
        open: 0,
        close: 743,
        low: 2,
        high: 0,
        diff: 7,
        percentage: 45,
        change: 3,
        avgCandle: 3,
        avgPct: 45,
        avgChg: 3,
        candlestick: {
          body: 371.5,
          bodyCenter: 184.75,
          color: CandlestickModel.Color.GREEN,
          isEngulfing: false,
          isHammer: true,
          isHangingMan: false,
          isPiercingPattern: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -371.5,
          value: 369.5
        }
      },
      {
        from: new Date('2021-04-05T04:00:00.000Z'),
        to: new Date('2021-04-06T04:00:00.000Z'),
        open: 0,
        close: 703,
        low: 5,
        high: 0,
        diff: 10,
        percentage: 15,
        change: 3,
        avgCandle: 3,
        avgPct: 15,
        avgChg: 3,
        candlestick: {
          body: 140.6,
          bodyCenter: 69.3,
          color: CandlestickModel.Color.GREEN,
          isEngulfing: false,
          isHammer: true,
          isHangingMan: false,
          isPiercingPattern: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -140.6,
          value: 138.6
        }
      },
      {
        from: new Date('2021-04-03T03:00:00.000Z'),
        to: new Date('2021-04-04T04:00:00.000Z'),
        open: 0,
        close: 456,
        low: 1,
        high: 0,
        diff: 3,
        percentage: 38,
        change: 3,
        avgPct: 38,
        avgChg: 3,
        avgCandle: 3,
        candlestick: {
          body: 456,
          bodyCenter: 227,
          color: CandlestickModel.Color.GREEN,
          isEngulfing: false,
          isHammer: true,
          isHangingMan: false,
          isPiercingPattern: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -456,
          value: 454
        }
      },
      {
        from: new Date('2021-04-05T04:00:00.000Z'),
        to: new Date('2021-04-06T04:00:00.000Z'),
        open: 0,
        close: 743,
        low: 3,
        high: 0,
        diff: 7,
        percentage: 15,
        change: 3,
        avgPct: 15,
        avgChg: 3,
        avgCandle: 3,
        candlestick: {
          body: 247.66666666666666,
          bodyCenter: 122.83333333333333,
          color: CandlestickModel.Color.GREEN,
          isEngulfing: false,
          isHammer: true,
          isHangingMan: false,
          isPiercingPattern: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -247.66666666666666,
          value: 245.66666666666666
        }
      }
    ]);
    expect(PerformanceModel.Json(p1)).toEqual([
      {
        from: new Date('2021-04-03T03:00:00.000Z'),
        to: new Date('2021-04-04T04:00:00.000Z'),
        diff: 3,
        percentage: 38,
        change: 3,
        avgChg: 3,
        avgPct: 38,
        avgCandle: 3,
        open: 0,
        close: 456,
        low: 1,
        high: 0,
        candlestick: {
          body: 456,
          bodyCenter: 227,
          color: CandlestickModel.Color.GREEN,
          isHammer: true,
          isHangingMan: false,
          lowerShadow: -1,
          numericType: 2,
          type: CandlestickModel.Type.HAMMER,
          upperShadow: -456,
          value: 454
        }
      }
    ]);
  });
});
