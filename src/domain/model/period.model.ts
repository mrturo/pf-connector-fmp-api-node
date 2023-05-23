import { DateUtil } from '../util/date.util';

export class Period {
  public static OneDayDaily: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'oneDayDaily',
    subperiods: {
      quantity: 1,
      frequency: 'DAY'
    },
    frequency: 'DAY'
  };
  public static TwoDaysDaily: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'twoDaysDaily',
    subperiods: {
      quantity: 2,
      frequency: 'DAY'
    },
    frequency: 'DAY'
  };
  public static ThreeDaysDaily: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'threeDaysDaily',
    subperiods: {
      quantity: 3,
      frequency: 'DAY'
    },
    frequency: 'DAY'
  };
  public static FiveDaysDaily: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'fiveDaysDaily',
    subperiods: {
      quantity: 7,
      frequency: 'DAY'
    },
    frequency: 'DAY'
  };
  public static FiveDaysWeekly: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'fiveDaysWeekly',
    subperiods: {
      quantity: 7,
      frequency: 'DAY'
    },
    frequency: 'WEEK'
  };
  public static OneWeekWeekly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'oneWeekWeekly',
    subperiods: {
      quantity: 1,
      frequency: 'WEEK'
    },
    frequency: 'WEEK'
  };
  public static FourWeeksWeekly: {
    name: string;
    subperiods: {
      quantity: number;
      frequency: number | string;
    };
    frequency: number | string;
  } = {
    name: 'fourWeeksWeekly',
    subperiods: {
      quantity: 4,
      frequency: 'WEEK'
    },
    frequency: 'WEEK'
  };
  public static OneMonthMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'oneMonthMonthly',
    subperiods: {
      quantity: 1,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static TwoMonthsMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'twoMonthsMonthly',
    subperiods: {
      quantity: 2,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static ThreeMonthsMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'threeMonthsMonthly',
    subperiods: {
      quantity: 3,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static FourMonthsMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'fourMonthsMonthly',
    subperiods: {
      quantity: 4,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static SixMonthsMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'sixMonthsMonthly',
    subperiods: {
      quantity: 6,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static TwelveMonthsMonthly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'twelveMonthsMonthly',
    subperiods: {
      quantity: 12,
      frequency: 'MONTH'
    },
    frequency: 'MONTH'
  };
  public static OneYearYearly: {
    name: string;
    subperiods: { quantity: number; frequency: number | string };
    frequency: number | string;
  } = {
    name: 'oneYearYearly',
    subperiods: {
      quantity: 1,
      frequency: 'YEAR'
    },
    frequency: 'YEAR'
  };
  public static SubPeriods(frequencyName: string): {
    quantity: number;
    frequency: number | string;
  } {
    let result: { quantity: number; frequency: number | string };
    switch (frequencyName) {
      case Period.OneDayDaily.name:
        result = Period.OneDayDaily.subperiods;
        break;
      case Period.TwoDaysDaily.name:
        result = Period.TwoDaysDaily.subperiods;
        break;
      case Period.ThreeDaysDaily.name:
        result = Period.ThreeDaysDaily.subperiods;
        break;
      case Period.FiveDaysDaily.name:
        result = Period.FiveDaysDaily.subperiods;
        break;
      case Period.FiveDaysWeekly.name:
        result = Period.FiveDaysWeekly.subperiods;
        break;
      case Period.OneWeekWeekly.name:
        result = Period.OneWeekWeekly.subperiods;
        break;
      case Period.FourWeeksWeekly.name:
        result = Period.FourWeeksWeekly.subperiods;
        break;
      case Period.OneMonthMonthly.name:
        result = Period.OneMonthMonthly.subperiods;
        break;
      case Period.TwoMonthsMonthly.name:
        result = Period.TwoMonthsMonthly.subperiods;
        break;
      case Period.ThreeMonthsMonthly.name:
        result = Period.ThreeMonthsMonthly.subperiods;
        break;
      case Period.FourMonthsMonthly.name:
        result = Period.FourMonthsMonthly.subperiods;
        break;
      case Period.SixMonthsMonthly.name:
        result = Period.SixMonthsMonthly.subperiods;
        break;
      case Period.TwelveMonthsMonthly.name:
        result = Period.TwelveMonthsMonthly.subperiods;
        break;
      case Period.OneYearYearly.name:
        result = Period.OneYearYearly.subperiods;
        break;
      default:
        result = Period.FourWeeksWeekly.subperiods;
        break;
    }
    return result;
  }
  public static Frequency(frequencyName: string): number | string {
    let result: number | string;
    switch (frequencyName) {
      case Period.OneDayDaily.name:
        result = Period.OneDayDaily.frequency;
        break;
      case Period.TwoDaysDaily.name:
        result = Period.TwoDaysDaily.frequency;
        break;
      case Period.ThreeDaysDaily.name:
        result = Period.ThreeDaysDaily.frequency;
        break;
      case Period.FiveDaysDaily.name:
        result = Period.FiveDaysDaily.frequency;
        break;
      case Period.FiveDaysWeekly.name:
        result = Period.FiveDaysWeekly.frequency;
        break;
      case Period.OneWeekWeekly.name:
        result = Period.OneWeekWeekly.frequency;
        break;
      case Period.FourWeeksWeekly.name:
        result = Period.FourWeeksWeekly.frequency;
        break;
      case Period.OneMonthMonthly.name:
        result = Period.OneMonthMonthly.frequency;
        break;
      case Period.TwoMonthsMonthly.name:
        result = Period.TwoMonthsMonthly.frequency;
        break;
      case Period.ThreeMonthsMonthly.name:
        result = Period.ThreeMonthsMonthly.frequency;
        break;
      case Period.FourMonthsMonthly.name:
        result = Period.FourMonthsMonthly.frequency;
        break;
      case Period.SixMonthsMonthly.name:
        result = Period.SixMonthsMonthly.frequency;
        break;
      case Period.TwelveMonthsMonthly.name:
        result = Period.TwelveMonthsMonthly.frequency;
        break;
      case Period.OneYearYearly.name:
        result = Period.OneYearYearly.frequency;
        break;
      default:
        result = Period.FourWeeksWeekly.frequency;
        break;
    }
    return result;
  }
  public static PrepareSubPeriod(period: {
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
  public static PrepareDiffPeriods(frequency: number | string): {
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
  public static CalculateNextUpdate(
    date: Date,
    frequency: string | number
  ): Date {
    const { days, months, years } = Period.PrepareDiffPeriods(frequency);
    return DateUtil.CleanHour(
      new Date(
        date.getFullYear() + years,
        date.getMonth() + months,
        date.getDate() + days + 1
      )
    );
  }
  private _from!: Date;
  private _to!: Date;
  private _subPeriods!: {
    from: Date;
    to: Date;
  }[];
  private _nextUpdate!: Date;
  constructor(
    date: Date | undefined = undefined,
    subPeriods: {
      quantity: number;
      frequency: number | string;
    } = Period.FourWeeksWeekly.subperiods,
    frequency: number | string = Period.FourWeeksWeekly.frequency
  ) {
    if (!date) {
      date = DateUtil.Today();
    }
    // date = DateUtil.PrevBusinessDay(date);
    // date.setDate(date.getDate() + 1);
    subPeriods = Period.PrepareSubPeriod(subPeriods);
    const { years, months, days } = Period.PrepareDiffPeriods(
      subPeriods.frequency
    );
    this.from = DateUtil.CleanHour(
      new Date(
        date.getFullYear() - subPeriods.quantity * years,
        date.getMonth() - subPeriods.quantity * months,
        date.getDate() - subPeriods.quantity * days
      )
    );
    this.to = DateUtil.CleanHour(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    );
    this.nextUpdate = Period.CalculateNextUpdate(date, frequency);
    this.subPeriods = [];
    for (let subPeriod = 1; subPeriod <= subPeriods.quantity; subPeriod++) {
      this.subPeriods.push({
        from: DateUtil.CleanHour(
          new Date(
            date.getFullYear() - subPeriod * years,
            date.getMonth() - subPeriod * months,
            date.getDate() - subPeriod * days
          )
        ),
        to: DateUtil.CleanHour(
          new Date(
            date.getFullYear() - (subPeriod - 1) * years,
            date.getMonth() - (subPeriod - 1) * months,
            date.getDate() - (subPeriod - 1) * days
          )
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
  public get nextUpdate(): Date {
    return this._nextUpdate;
  }
  public set nextUpdate(value: Date) {
    this._nextUpdate = value;
  }
  public get json(): any {
    return {
      from: this.from,
      to: this.to,
      subPeriods: this.subPeriods.sort(
        (a: { from: Date; to: Date }, b: { from: Date; to: Date }) =>
          a.from.getTime() - b.from.getTime()
      ),
      nextUpdate: this.nextUpdate
    };
  }
}
