import { Performance as PerformanceModel } from '../../../src/domain/model/performance.model';

describe('Class Performance Model', () => {
  it('Happy Path 1', async () => {
    const performance: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 10),
      678,
      16.9,
      2
    );
    expect(performance.json()).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      price: 2
    });
  });
  it('Happy Path 2', async () => {
    const performance: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 10),
      678,
      16.9,
      2
    );
    const p1: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 6),
      new Date(2019, 5, 8),
      678,
      16.9,
      2
    );
    const p2: PerformanceModel = new PerformanceModel(
      new Date(2019, 5, 8),
      new Date(2019, 5, 10),
      678,
      16.9,
      2
    );
    expect(performance.json([p1, p2])).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      price: 2,
      subPeriods: PerformanceModel.json([p1, p2])
    });
    expect(performance.json([p1])).toEqual({
      from: new Date(2019, 5, 6),
      to: new Date(2019, 5, 10),
      diff: 678,
      percentage: 16.9,
      price: 2
    });
  });
  it('Happy Path - buildFromHistory 1', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.buildFromHistory(
        [
          { date: '2023-05-18T00:00:00.000Z', open: 178.92, close: 179.72 },
          { date: '2023-05-17T00:00:00.000Z', open: 182.35, close: 178.94 },
          { date: '2023-05-16T00:00:00.000Z', open: 182.87, close: 181.45 },
          { date: '2023-05-15T00:00:00.000Z', open: 183.6, close: 183.85 },
          { date: '2023-05-12T00:00:00.000Z', open: 184.38, close: 183.62 },
          { date: '2023-05-11T00:00:00.000Z', open: 185.84, close: 185.12 }
        ],
        new Date('2023-05-18T00:00:00.000Z'),
        new Date('2023-05-11T00:00:00.000Z')
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      diff: -5.400000000000006,
      from: new Date('2023-05-11T00:00:00.000Z'),
      percentage: -2.917026793431291,
      price: 179.72,
      to: new Date('2023-05-18T00:00:00.000Z')
    });
  });
  it('Happy Path - buildFromHistory - 2', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.buildFromHistory([
        { date: '2023-05-18T00:00:00.000Z', open: 178.92, close: 179.72 },
        { date: '2023-05-17T00:00:00.000Z', open: 182.35, close: 178.94 },
        { date: '2023-05-16T00:00:00.000Z', open: 182.87, close: 181.45 },
        { date: '2023-05-15T00:00:00.000Z', open: 183.6, close: 183.85 },
        { date: '2023-05-12T00:00:00.000Z', open: 184.38, close: 183.62 },
        { date: '2023-05-11T00:00:00.000Z', open: 185.84, close: 185.12 }
      ]);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      diff: -5.400000000000006,
      from: new Date('2023-05-11T00:00:00.000Z'),
      percentage: -2.917026793431291,
      price: 179.72,
      to: new Date('2023-05-18T00:00:00.000Z')
    });
  });
  it('Happy Path - buildFromHistory 3', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.buildFromHistory(
        [
          { date: '2023-05-18T00:00:00.000Z', open: 178.92, close: 179.72 },
          { date: '2023-05-17T00:00:00.000Z', open: 182.35, close: 178.94 },
          { date: '2023-05-16T00:00:00.000Z', open: 182.87, close: 181.45 },
          { date: '2023-05-15T00:00:00.000Z', open: 183.6, close: 183.85 },
          { date: '2023-05-12T00:00:00.000Z', open: 184.38, close: 183.62 },
          { date: '2023-05-11T00:00:00.000Z', open: 185.84, close: 185.12 }
        ],
        new Date('2023-05-18T00:00:00.000Z')
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      diff: 0.8000000000000114,
      from: new Date('2023-05-18T00:00:00.000Z'),
      percentage: 0.44712720769059433,
      price: 179.72,
      to: new Date('2023-05-18T00:00:00.000Z')
    });
  });
  it('Happy Path - buildFromHistory 4', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.buildFromHistory(
        [
          { date: '2023-05-18T00:00:00.000Z', open: 178.92, close: 179.72 },
          { date: '2023-05-17T00:00:00.000Z', open: 182.35, close: 178.94 },
          { date: '2023-05-16T00:00:00.000Z', open: 182.87, close: 181.45 },
          { date: '2023-05-15T00:00:00.000Z', open: 183.6, close: 183.85 },
          { date: '2023-05-12T00:00:00.000Z', open: 184.38, close: 183.62 },
          { date: '2023-05-11T00:00:00.000Z', open: 185.84, close: 185.12 }
        ],
        undefined,
        new Date('2023-05-11T00:00:00.000Z')
      );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(performance!.json()).toEqual({
      diff: -0.7199999999999989,
      from: new Date('2023-05-11T00:00:00.000Z'),
      percentage: -0.3874300473525607,
      price: 185.12,
      to: new Date('2023-05-11T00:00:00.000Z')
    });
  });
  it('Happy Path - buildFromHistory 5', async () => {
    const performance: PerformanceModel | undefined =
      PerformanceModel.buildFromHistory([]);
    expect(performance).toBeUndefined();
  });
  it('Happy Path - Json array', async () => {
    const p1: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 3),
      new Date(2021, 3, 4),
      3,
      38,
      456
    );
    const p2: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      45,
      743
    );
    const p3: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      15,
      743
    );
    const p4: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      7,
      15,
      703
    );
    const p5: PerformanceModel = new PerformanceModel(
      new Date(2021, 3, 5),
      new Date(2021, 3, 6),
      10,
      15,
      703
    );
    console.log(
      'JSON:' + JSON.stringify(PerformanceModel.json([p4, p2, p5, p1, p3]))
    );
    expect(PerformanceModel.json([p4, p2, p5, p1, p3])).toEqual([
      {
        diff: 3,
        from: new Date('2021-04-03T03:00:00.000Z'),
        percentage: 38,
        price: 456,
        to: new Date('2021-04-04T04:00:00.000Z')
      },
      {
        diff: 7,
        from: new Date('2021-04-05T04:00:00.000Z'),
        percentage: 45,
        price: 743,
        to: new Date('2021-04-06T04:00:00.000Z')
      },
      {
        diff: 7,
        from: new Date('2021-04-05T04:00:00.000Z'),
        percentage: 15,
        price: 743,
        to: new Date('2021-04-06T04:00:00.000Z')
      },
      {
        diff: 10,
        from: new Date('2021-04-05T04:00:00.000Z'),
        percentage: 15,
        price: 703,
        to: new Date('2021-04-06T04:00:00.000Z')
      },
      {
        diff: 7,
        from: new Date('2021-04-05T04:00:00.000Z'),
        percentage: 15,
        price: 703,
        to: new Date('2021-04-06T04:00:00.000Z')
      }
    ]);
    expect(PerformanceModel.json(p1)).toEqual([
      {
        diff: 3,
        from: new Date('2021-04-03T03:00:00.000Z'),
        percentage: 38,
        price: 456,
        to: new Date('2021-04-04T04:00:00.000Z')
      }
    ]);
  });
});
