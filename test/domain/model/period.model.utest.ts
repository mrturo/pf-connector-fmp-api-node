import { Period as PeriodModel } from '../../../src/domain/model/period.model';

describe('Class Period Model', () => {
  it('Happy Path - Simple 1', async () => {
    const date = new Date();
    const period = new PeriodModel(new Date(), PeriodModel.oneWeekWeekly.value);
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
  it('Happy Path - Simple 2', async () => {
    const date = new Date();
    const period = new PeriodModel(date, { quantity: 0, frequency: 0 });
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    expect(period.json).toEqual({
      from: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
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
      subPeriods: [
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 1,
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
  it('Happy Path - Simple 3', async () => {
    const date = new Date(2012, 5, 9); // 09-06-2012
    const period = new PeriodModel(date, { quantity: 2, frequency: 7 });
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    expect(period.json).toEqual({
      from: new Date(2012, 4, 26, timezoneOffset, 0, 0, 0), // 26-05-2012
      to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0), // 09-06-2012
      subPeriods: [
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
  it('Happy Path - Simple 4', async () => {
    const date = new Date(2012, 5, 9); // 09-06-2012
    const period = new PeriodModel(date, { quantity: 4, frequency: 7 });
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    expect(period.json).toEqual({
      from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
      to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0), // 09-06-2012
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
    const period = new PeriodModel(date, PeriodModel.fourWeeksWeekly.value);
    expect(period.json).toEqual({
      from: new Date(2012, 4, 12, timezoneOffset, 0, 0, 0), // 12-05-2012
      to: new Date(2012, 5, 9, timezoneOffset, 0, 0, 0), // 09-06-2012
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
    const date = new Date();
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    const period = new PeriodModel();
    expect(period.json).toEqual({
      from: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 7 * 4,
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
      subPeriods: [
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 4,
            timezoneOffset,
            0,
            0,
            0
          ),
          to: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 3,
            timezoneOffset,
            0,
            0,
            0
          )
        },
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 3,
            timezoneOffset,
            0,
            0,
            0
          ),
          to: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 2,
            timezoneOffset,
            0,
            0,
            0
          )
        },
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 2,
            timezoneOffset,
            0,
            0,
            0
          ),
          to: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 1,
            timezoneOffset,
            0,
            0,
            0
          )
        },
        {
          from: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 1,
            timezoneOffset,
            0,
            0,
            0
          ),
          to: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - 7 * 0,
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
    expect(PeriodModel.prepareSubPeriod({ quantity: 1, frequency: 1 })).toEqual(
      { quantity: 1, frequency: 1 }
    );
  });
  it('Happy Path - prepareSubPeriod 2', async () => {
    expect(
      PeriodModel.prepareSubPeriod({ quantity: 1, frequency: 'x' })
    ).toEqual({ quantity: 1, frequency: 'X' });
  });
  it('Happy Path - prepareSubPeriod 3', async () => {
    expect(
      PeriodModel.prepareSubPeriod({ quantity: 1, frequency: ' ' })
    ).toEqual({ quantity: 1, frequency: 1 });
  });
  it('Happy Path - prepareDiffPeriods 1', async () => {
    expect(PeriodModel.prepareDiffPeriods(3)).toEqual({
      years: 0,
      months: 0,
      days: 3
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.prepareDiffPeriods('WEEK')).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.prepareDiffPeriods('MONTH')).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
  });
  it('Happy Path - prepareDiffPeriods 2', async () => {
    expect(PeriodModel.prepareDiffPeriods('YEAR')).toEqual({
      years: 1,
      months: 0,
      days: 0
    });
  });
  it('Happy Path - Defined Periods', async () => {
    expect(PeriodModel.fiveDaysDaily.value).toEqual({
      quantity: 7,
      frequency: 'DAY'
    });
    expect(
      PeriodModel.prepareDiffPeriods(PeriodModel.fiveDaysDaily.value.frequency)
    ).toEqual({
      years: 0,
      months: 0,
      days: 1
    });
    expect(PeriodModel.fourWeeksWeekly.value).toEqual({
      quantity: 4,
      frequency: 'WEEK'
    });
    expect(
      PeriodModel.prepareDiffPeriods(
        PeriodModel.fourWeeksWeekly.value.frequency
      )
    ).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
    expect(PeriodModel.oneWeekWeekly.value).toEqual({
      quantity: 1,
      frequency: 'WEEK'
    });
    expect(
      PeriodModel.prepareDiffPeriods(PeriodModel.oneWeekWeekly.value.frequency)
    ).toEqual({
      years: 0,
      months: 0,
      days: 7
    });
    expect(PeriodModel.oneMonthMonthly.value).toEqual({
      quantity: 1,
      frequency: 'MONTH'
    });
    expect(
      PeriodModel.prepareDiffPeriods(
        PeriodModel.oneMonthMonthly.value.frequency
      )
    ).toEqual({
      years: 0,
      months: 1,
      days: 0
    });
    expect(PeriodModel.oneYearYearly.value).toEqual({
      quantity: 1,
      frequency: 'YEAR'
    });
    expect(
      PeriodModel.prepareDiffPeriods(PeriodModel.oneYearYearly.value.frequency)
    ).toEqual({
      years: 1,
      months: 0,
      days: 0
    });
  });

  it('Happy Path - findFrequency', async () => {
    expect(PeriodModel.findFrequency('')).toEqual(
      PeriodModel.fourWeeksWeekly.value
    );
    expect(PeriodModel.findFrequency('fiveDaysDaily')).toEqual(
      PeriodModel.fiveDaysDaily.value
    );
    expect(PeriodModel.findFrequency('fourWeeksWeekly')).toEqual(
      PeriodModel.fourWeeksWeekly.value
    );
    expect(PeriodModel.findFrequency('oneWeekWeekly')).toEqual(
      PeriodModel.oneWeekWeekly.value
    );
    expect(PeriodModel.findFrequency('oneMonthMonthly')).toEqual(
      PeriodModel.oneMonthMonthly.value
    );
    expect(PeriodModel.findFrequency('oneYearYearly')).toEqual(
      PeriodModel.oneYearYearly.value
    );
  });
});
