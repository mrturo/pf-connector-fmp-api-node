export class Period {
  public static fiveDaysDaily: {
    name: string;
    value: {
      quantity: number;
      frequency: number | string;
    };
  } = {
    name: 'fiveDaysDaily',
    value: {
      quantity: 7,
      frequency: 'DAY'
    }
  };
  public static fourWeeksWeekly: {
    name: string;
    value: {
      quantity: number;
      frequency: number | string;
    };
  } = {
    name: 'fourWeeksWeekly',
    value: {
      quantity: 4,
      frequency: 'WEEK'
    }
  };
  public static oneWeekWeekly: {
    name: string;
    value: { quantity: number; frequency: number | string };
  } = {
    name: 'oneWeekWeekly',
    value: {
      quantity: 1,
      frequency: 'WEEK'
    }
  };
  public static oneMonthMonthly: {
    name: string;
    value: { quantity: number; frequency: number | string };
  } = {
    name: 'oneMonthMonthly',
    value: {
      quantity: 1,
      frequency: 'MONTH'
    }
  };
  public static oneYearYearly: {
    name: string;
    value: { quantity: number; frequency: number | string };
  } = {
    name: 'oneYearYearly',
    value: {
      quantity: 1,
      frequency: 'YEAR'
    }
  };
  public static findFrequency(frequencyName: string): {
    quantity: number;
    frequency: number | string;
  } {
    let result: { quantity: number; frequency: number | string };
    switch (frequencyName) {
      case Period.fiveDaysDaily.name:
        result = Period.fiveDaysDaily.value;
        break;
      case Period.fourWeeksWeekly.name:
        result = Period.fourWeeksWeekly.value;
        break;
      case Period.oneWeekWeekly.name:
        result = Period.oneWeekWeekly.value;
        break;
      case Period.oneMonthMonthly.name:
        result = Period.oneMonthMonthly.value;
        break;
      case Period.oneYearYearly.name:
        result = Period.oneYearYearly.value;
        break;
      default:
        result = Period.fourWeeksWeekly.value;
        break;
    }
    return result;
  }
  public static prepareSubPeriod(period: {
    quantity: number;
    frequency: number | string;
  }): { quantity: number; frequency: number | string } {
    period.quantity = period.quantity < 1 ? 1 : period.quantity;
    period.frequency =
      (typeof period.frequency === 'string' &&
        period.frequency.trim().length === 0) ||
      (typeof period.frequency === 'number' && period.frequency < 1)
        ? 1
        : typeof period.frequency === 'string'
        ? period.frequency.trim().toUpperCase()
        : period.frequency;
    return period;
  }
  public static prepareDiffPeriods(frequency: number | string): {
    years: number;
    months: number;
    days: number;
  } {
    let days = 0,
      months = 0,
      years = 0;
    if (typeof frequency === 'number') {
      days = frequency;
    } else if (frequency.trim().toUpperCase() === 'DAY') {
      days = 1;
    } else if (frequency.trim().toUpperCase() === 'WEEK') {
      days = 7;
    } else if (frequency.trim().toUpperCase() === 'MONTH') {
      months = 1;
    } else if (frequency.trim().toUpperCase() === 'YEAR') {
      years = 1;
    }
    return { years, months, days };
  }
  private _from!: Date;
  private _to!: Date;
  private _subPeriods!: {
    from: Date;
    to: Date;
  }[];
  constructor(
    date: Date = new Date(),
    subPeriods: {
      quantity: number;
      frequency: number | string;
    } = Period.fourWeeksWeekly.value
  ) {
    subPeriods = Period.prepareSubPeriod(subPeriods);
    const { years, months, days } = Period.prepareDiffPeriods(
      subPeriods.frequency
    );
    const timezoneOffset = -(date.getTimezoneOffset() / 60);
    this.from = new Date(
      date.getFullYear() - subPeriods.quantity * years,
      date.getMonth() - subPeriods.quantity * months,
      date.getDate() - subPeriods.quantity * days,
      timezoneOffset,
      0,
      0,
      0
    );
    this.to = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      timezoneOffset,
      0,
      0,
      0
    );
    this.subPeriods = [];
    for (let subPeriod = 1; subPeriod <= subPeriods.quantity; subPeriod++) {
      const from = new Date(
        date.getFullYear() - subPeriod * years,
        date.getMonth() - subPeriod * months,
        date.getDate() - subPeriod * days,
        timezoneOffset,
        0,
        0,
        0
      );
      this.subPeriods.push({
        from: from,
        to: new Date(
          date.getFullYear() - (subPeriod - 1) * years,
          date.getMonth() - (subPeriod - 1) * months,
          date.getDate() - (subPeriod - 1) * days,
          timezoneOffset,
          0,
          0,
          0
        )
      });
    }
  }
  public get from(): Date {
    return this._from;
  }
  private set from(value: Date) {
    this._from = value;
  }
  public get to(): Date {
    return this._to;
  }
  private set to(value: Date) {
    this._to = value;
  }
  public get subPeriods(): {
    from: Date;
    to: Date;
  }[] {
    return this._subPeriods;
  }
  private set subPeriods(
    value: {
      from: Date;
      to: Date;
    }[]
  ) {
    this._subPeriods = value;
  }
  public get json(): any {
    return {
      from: this.from,
      to: this.to,
      subPeriods: this.subPeriods.sort(
        (a: { from: Date; to: Date }, b: { from: Date; to: Date }) =>
          a.from.getTime() - b.from.getTime()
      )
    };
  }
}
