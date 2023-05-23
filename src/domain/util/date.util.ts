import moment from 'moment-business-days';

export class DateUtil {
  public static CleanHour(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      -(date.getTimezoneOffset() / 60),
      0,
      0,
      0
    );
  }
  public static Today(): Date {
    const date = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      -(date.getTimezoneOffset() / 60),
      0,
      0,
      0
    );
  }
  public static Yesterday(): Date {
    const date = DateUtil.Today();
    date.setDate(date.getDate() - 1);
    date.setHours(-(date.getTimezoneOffset() / 60));
    return date;
  }
  public static PrevBusinessDay(today: Date = DateUtil.Today()): Date {
    const year = today.getFullYear().toString().padStart(4, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const date = moment(`${day}-${month}-${year}`, 'DD-MM-YYYY')
      .prevBusinessDay()
      .toDate();
    date.setHours(-(date.getTimezoneOffset() / 60));
    return date;
  }
  public static SetDate(inDate: string | Date | undefined = undefined): Date {
    const today = DateUtil.Today();
    let date: Date = today;
    if (typeof inDate === 'string') {
      const spplitedDate = inDate.split('-');
      date = DateUtil.CleanHour(
        new Date(+spplitedDate[0], +spplitedDate[1] - 1, +spplitedDate[2])
      );
    } else if (inDate instanceof Date) {
      date = DateUtil.CleanHour(inDate);
    }
    if (date && date.getTime() > today.getTime()) {
      date = today;
    }
    return date;
  }
}
