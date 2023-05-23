import { Period as PeriodModel } from '../../../src/domain/model/period.model';
import { DateUtil } from '../../../src/domain/util/date.util';

describe('Class Period Model', () => {
  it('Happy Path - Simple 1', async () => {
    const date = DateUtil.Today();
    const period = new PeriodModel(
      date,
      PeriodModel.OneWeekWeekly.subperiods,
      PeriodModel.OneWeekWeekly.frequency
    );
    const from = DateUtil.CleanHour(
      new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    );
    const to = DateUtil.CleanHour(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const nextUpdate = DateUtil.CleanHour(
      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 8)
    );
    expect(period.json).toEqual({
      from: from,
      to: to,
      nextUpdate: nextUpdate,
      subPeriods: [
        {
          from: from,
          to: to
        }
      ]
    });
  });
  it('Happy Path - Simple 2', async () => {
    const date = DateUtil.Today();
    const period = new PeriodModel(date, { quantity: 0, frequency: 0 }, 0);
    expect(period.json).toEqual({
      from: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
      ),
      to: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate())
      ),
      nextUpdate: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      ),
      subPeriods: [
        {
          from: DateUtil.CleanHour(
            new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
          ),
          to: DateUtil.CleanHour(
            new Date(date.getFullYear(), date.getMonth(), date.getDate())
          )
        }
      ]
    });
  });
  it('Happy Path - Simple 3', async () => {
    const date = DateUtil.CleanHour(new Date(2012, 5, 9)); // 09-06-2012
    const period = new PeriodModel(date, { quantity: 2, frequency: 7 }, 7);
    expect(period.json).toEqual({
      from: DateUtil.CleanHour(new Date(2012, 4, 25)), // 25-05-2012
      to: DateUtil.CleanHour(new Date(2012, 5, 8)), // 08-06-2012
      nextUpdate: DateUtil.CleanHour(new Date(2012, 5, 16)), // 16-06-2012
      subPeriods: [
        {
          from: DateUtil.CleanHour(new Date(2012, 4, 25)), // 25-05-2012
          to: DateUtil.CleanHour(new Date(2012, 5, 1)) // 01-06-2012
        },
        {
          from: DateUtil.CleanHour(new Date(2012, 5, 1)), // 01-06-2012
          to: DateUtil.CleanHour(new Date(2012, 5, 8)) // 08-06-2012
        }
      ]
    });
  });
  it('Happy Path - Simple 4', async () => {
    const date = new Date(2012, 5, 9); // 09-06-2012
    const period = new PeriodModel(date, { quantity: 4, frequency: 7 }, 7);
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    expect(period.json).toEqual({
      from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
      to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0), // 09-06-2012
      nextUpdate: new Date(2012, 5, 17, timezoneOffset, 0, 0, 0), // 16-06-2012
      subPeriods: [
        {
          from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
          to: new Date(2012, 4, 19, timezoneOffset, 0, 0, 0) // 19-05-2012
        },
        {
          from: new Date(2012, 4, 19, timezoneOffset, 0, 0, 0), // 19-05-2012
          to: new Date(2012, 4, 26, timezoneOffset, 0, 0, 0) // 26-05-2012
        },
        {
          from: new Date(2012, 4, 26, timezoneOffset, 0, 0, 0), // 26-05-2012
          to: new Date(2012, 5, 2, timezoneOffset, 0, 0, 0) // 02-06-2012
        },
        {
          from: new Date(2012, 5, 2, timezoneOffset, 0, 0, 0), // 02-06-2012
          to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0) // 09-06-2012
        }
      ]
    });
  });
  it('Happy Path - Simple 5', async () => {
    const date = new Date(2012, 5, 9);
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    const period = new PeriodModel(
      date,
      PeriodModel.FourWeeksWeekly.subperiods,
      PeriodModel.FourWeeksWeekly.frequency
    );
    expect(period.json).toEqual({
      from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
      to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0), // 09-06-2012
      nextUpdate: new Date(2012, 5, 17, timezoneOffset, 0, 0, 0), // 15-06-2012
      subPeriods: [
        {
          from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
          to: new Date(2012, 4, 19, timezoneOffset, 0, 0, 0) // 19-05-2012
        },
        {
          from: new Date(2012, 4, 19, timezoneOffset, 0, 0, 0), // 19-05-2012
          to: new Date(2012, 4, 26, timezoneOffset, 0, 0, 0) // 26-05-2012
        },
        {
          from: new Date(2012, 4, 26, timezoneOffset, 0, 0, 0), // 26-05-2012
          to: new Date(2012, 5, 2, timezoneOffset, 0, 0, 0) // 02-06-2012
        },
        {
          from: new Date(2012, 5, 2, timezoneOffset, 0, 0, 0), // 02-06-2012
          to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0) // 09-06-2012
        }
      ]
    });
  });
  it('Happy Path - Simple 6', async () => {
    const date = DateUtil.Today();
    const period = new PeriodModel();
    expect(period.json).toEqual({
      from: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7 * 4)
      ),
      to: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate())
      ),
      nextUpdate: DateUtil.CleanHour(
        new Date(date.getFullYear(), date.getMonth(), date.getDate() + 8)
      ),
      subPeriods: [
        {
          from: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 4
            )
          ),
          to: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 3
            )
          )
        },
        {
          from: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 3
            )
          ),
          to: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 2
            )
          )
        },
        {
          from: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 2
            )
          ),
          to: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 1
            )
          )
        },
        {
          from: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 1
            )
          ),
          to: DateUtil.CleanHour(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() - 7 * 0
            )
          )
        }
      ]
    });
  });
  it('Happy Path - Simple 7', async () => {
    const date = DateUtil.Today();
    const period = new PeriodModel(
      date,
      PeriodModel.OneWeekWeekly.subperiods,
      PeriodModel.OneWeekWeekly.frequency
    );
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    expect(period.json).toEqual({
      from: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 7,
        timezoneOffset,
        0,
        0,
        0
      ),
      to: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        timezoneOffset,
        0,
        0,
        0
      ),
      nextUpdate: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 8,
        timezoneOffset,
        0,
        0,
        0
      ),
      subPeriods: [
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7,
            timezoneOffset,
            0,
            0,
            0
          ),
          to: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            timezoneOffset,
            0,
            0,
            0
          )
        }
      ]
    });
  });
  it('Happy Path - prepareSubPeriod 1', async () => {
    expect(PeriodModel.PrepareSubPeriod({ quantity: 1, frequency: 1 })).toEqual(
      { quantity: 1, frequency: 1 }
    );
  });
  it('Happy Path - prepareSubPeriod 2', async () => {
    expect(
      PeriodModel.PrepareSubPeriod({ quantity: 1, frequency: 'x' })
    ).toEqual({ quantity: 1, frequency: 'X' });
  });
  it('Happy Path - prepareSubPeriod 3', async () => {
    expect(
      PeriodModel.PrepareSubPeriod({ quantity: 1, frequency: ' ' })
    ).toEqual({ quantity: 1, frequency: 1 });
  });
  it('Happy Path - prepareDiffPeriods 1', async () => {
    expect(PeriodModel.PrepareDiffPeriods(3)).toEqual({
      years: 0,
      months: 0,
      days: 3
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.PrepareDiffPeriods('WEEK')).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.PrepareDiffPeriods('MONTH')).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.PrepareDiffPeriods('YEAR')).toEqual({
      years: 1,
      months: 0,
      days: 0
    });
  });
  it('Happy Path - Defined Periods', async () => {
    expect(PeriodModel.OneDayDaily.subperiods).toEqual({
      quantity: 1,
      frequency: 'DAY'
    });
    expect(PeriodModel.OneDayDaily.frequency).toBe('DAY');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.OneDayDaily.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.TwoDaysDaily.subperiods).toEqual({
      quantity: 2,
      frequency: 'DAY'
    });
    expect(PeriodModel.TwoDaysDaily.frequency).toBe('DAY');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.TwoDaysDaily.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.ThreeDaysDaily.subperiods).toEqual({
      quantity: 3,
      frequency: 'DAY'
    });
    expect(PeriodModel.ThreeDaysDaily.frequency).toBe('DAY');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.ThreeDaysDaily.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.FiveDaysDaily.subperiods).toEqual({
      quantity: 7,
      frequency: 'DAY'
    });
    expect(PeriodModel.FiveDaysDaily.frequency).toBe('DAY');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.FiveDaysDaily.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.FiveDaysWeekly.subperiods).toEqual({
      quantity: 7,
      frequency: 'DAY'
    });
    expect(PeriodModel.FiveDaysWeekly.frequency).toBe('WEEK');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.FiveDaysWeekly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.OneWeekWeekly.subperiods).toEqual({
      quantity: 1,
      frequency: 'WEEK'
    });
    expect(PeriodModel.OneWeekWeekly.frequency).toBe('WEEK');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.OneWeekWeekly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
    expect(PeriodModel.FourWeeksWeekly.subperiods).toEqual({
      quantity: 4,
      frequency: 'WEEK'
    });
    expect(PeriodModel.FourWeeksWeekly.frequency).toBe('WEEK');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.FourWeeksWeekly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
    expect(PeriodModel.OneMonthMonthly.subperiods).toEqual({
      quantity: 1,
      frequency: 'MONTH'
    });
    expect(PeriodModel.OneMonthMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.OneMonthMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.TwoMonthsMonthly.subperiods).toEqual({
      quantity: 2,
      frequency: 'MONTH'
    });
    expect(PeriodModel.TwoMonthsMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.TwoMonthsMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.ThreeMonthsMonthly.subperiods).toEqual({
      quantity: 3,
      frequency: 'MONTH'
    });
    expect(PeriodModel.ThreeMonthsMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.ThreeMonthsMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.FourMonthsMonthly.subperiods).toEqual({
      quantity: 4,
      frequency: 'MONTH'
    });
    expect(PeriodModel.FourMonthsMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.FourMonthsMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.SixMonthsMonthly.subperiods).toEqual({
      quantity: 6,
      frequency: 'MONTH'
    });
    expect(PeriodModel.SixMonthsMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.SixMonthsMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.TwelveMonthsMonthly.subperiods).toEqual({
      quantity: 12,
      frequency: 'MONTH'
    });
    expect(PeriodModel.TwelveMonthsMonthly.frequency).toBe('MONTH');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.TwelveMonthsMonthly.subperiods.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.OneYearYearly.subperiods).toEqual({
      quantity: 1,
      frequency: 'YEAR'
    });
    expect(PeriodModel.OneYearYearly.frequency).toBe('YEAR');
    expect(
      PeriodModel.PrepareDiffPeriods(
        PeriodModel.OneYearYearly.subperiods.frequency
      )
    ).toEqual({
      years: 1,
      months: 0,
      days: 0
    });
  });
  it('Happy Path - SubPeriods - 1', async () => {
    expect(PeriodModel.SubPeriods('')).toEqual(
      PeriodModel.FourWeeksWeekly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 2', async () => {
    expect(PeriodModel.SubPeriods('oneDayDaily')).toEqual(
      PeriodModel.OneDayDaily.subperiods
    );
  });
  it('Happy Path - SubPeriods - 3', async () => {
    expect(PeriodModel.SubPeriods('twoDaysDaily')).toEqual(
      PeriodModel.TwoDaysDaily.subperiods
    );
  });
  it('Happy Path - SubPeriods - 4', async () => {
    expect(PeriodModel.SubPeriods('threeDaysDaily')).toEqual(
      PeriodModel.ThreeDaysDaily.subperiods
    );
  });
  it('Happy Path - SubPeriods - 5', async () => {
    expect(PeriodModel.SubPeriods('fiveDaysDaily')).toEqual(
      PeriodModel.FiveDaysDaily.subperiods
    );
  });
  it('Happy Path - SubPeriods - 6', async () => {
    expect(PeriodModel.SubPeriods('fiveDaysWeekly')).toEqual(
      PeriodModel.FiveDaysWeekly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 7', async () => {
    expect(PeriodModel.SubPeriods('oneWeekWeekly')).toEqual(
      PeriodModel.OneWeekWeekly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 8', async () => {
    expect(PeriodModel.SubPeriods('fourWeeksWeekly')).toEqual(
      PeriodModel.FourWeeksWeekly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 9', async () => {
    expect(PeriodModel.SubPeriods('oneMonthMonthly')).toEqual(
      PeriodModel.OneMonthMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 10', async () => {
    expect(PeriodModel.SubPeriods('twoMonthsMonthly')).toEqual(
      PeriodModel.TwoMonthsMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 11', async () => {
    expect(PeriodModel.SubPeriods('threeMonthsMonthly')).toEqual(
      PeriodModel.ThreeMonthsMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 12', async () => {
    expect(PeriodModel.SubPeriods('fourMonthsMonthly')).toEqual(
      PeriodModel.FourMonthsMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 13', async () => {
    expect(PeriodModel.SubPeriods('sixMonthsMonthly')).toEqual(
      PeriodModel.SixMonthsMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 14', async () => {
    expect(PeriodModel.SubPeriods('twelveMonthsMonthly')).toEqual(
      PeriodModel.TwelveMonthsMonthly.subperiods
    );
  });
  it('Happy Path - SubPeriods - 15', async () => {
    expect(PeriodModel.SubPeriods('oneYearYearly')).toEqual(
      PeriodModel.OneYearYearly.subperiods
    );
  });
  it('Happy Path - Frequency - 1', async () => {
    expect(PeriodModel.Frequency('')).toEqual(
      PeriodModel.FourWeeksWeekly.frequency
    );
  });
  it('Happy Path - Frequency - 2', async () => {
    expect(PeriodModel.Frequency('oneDayDaily')).toEqual(
      PeriodModel.OneDayDaily.frequency
    );
  });
  it('Happy Path - Frequency - 3', async () => {
    expect(PeriodModel.Frequency('twoDaysDaily')).toEqual(
      PeriodModel.TwoDaysDaily.frequency
    );
  });
  it('Happy Path - Frequency - 4', async () => {
    expect(PeriodModel.Frequency('threeDaysDaily')).toEqual(
      PeriodModel.ThreeDaysDaily.frequency
    );
  });
  it('Happy Path - Frequency - 5', async () => {
    expect(PeriodModel.Frequency('fiveDaysDaily')).toEqual(
      PeriodModel.FiveDaysDaily.frequency
    );
  });
  it('Happy Path - Frequency - 6', async () => {
    expect(PeriodModel.Frequency('fiveDaysWeekly')).toEqual(
      PeriodModel.FiveDaysWeekly.frequency
    );
  });
  it('Happy Path - Frequency - 7', async () => {
    expect(PeriodModel.Frequency('oneWeekWeekly')).toEqual(
      PeriodModel.OneWeekWeekly.frequency
    );
  });
  it('Happy Path - Frequency - 8', async () => {
    expect(PeriodModel.Frequency('fourWeeksWeekly')).toEqual(
      PeriodModel.FourWeeksWeekly.frequency
    );
  });
  it('Happy Path - Frequency - 9', async () => {
    expect(PeriodModel.Frequency('oneMonthMonthly')).toEqual(
      PeriodModel.OneMonthMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 10', async () => {
    expect(PeriodModel.Frequency('twoMonthsMonthly')).toEqual(
      PeriodModel.TwoMonthsMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 11', async () => {
    expect(PeriodModel.Frequency('threeMonthsMonthly')).toEqual(
      PeriodModel.ThreeMonthsMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 12', async () => {
    expect(PeriodModel.Frequency('fourMonthsMonthly')).toEqual(
      PeriodModel.FourMonthsMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 13', async () => {
    expect(PeriodModel.Frequency('sixMonthsMonthly')).toEqual(
      PeriodModel.SixMonthsMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 14', async () => {
    expect(PeriodModel.Frequency('twelveMonthsMonthly')).toEqual(
      PeriodModel.TwelveMonthsMonthly.frequency
    );
  });
  it('Happy Path - Frequency - 15', async () => {
    expect(PeriodModel.Frequency('oneYearYearly')).toEqual(
      PeriodModel.OneYearYearly.frequency
    );
  });
});
