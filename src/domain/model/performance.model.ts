import { DateUtil } from '../util/date.util';
import { Candlestick as CandlestickModel } from './candlestick.model';

export class Performance {
  public static BuildFromHistory(
    historicalPrice: any,
    from: Date | undefined = undefined,
    to: Date | undefined = undefined,
    nextUpdate: Date | undefined = undefined
  ): Performance | undefined {
    if (
      historicalPrice !== null &&
      Array.isArray(historicalPrice) &&
      historicalPrice.length > 0
    ) {
      const map = new Map();
      for (const item of historicalPrice) {
        map.set(item.date, item);
      }
      historicalPrice = Array.from(map.values()).sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!from && !to) {
        from = DateUtil.CleanHour(historicalPrice[0].date);
        to = DateUtil.CleanHour(
          historicalPrice[historicalPrice.length - 1].date
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (!from && to) {
        from = DateUtil.CleanHour(to);
        to = DateUtil.CleanHour(to);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (from && !to) {
        from = DateUtil.CleanHour(from);
        to = DateUtil.CleanHour(from);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (to!.getTime() < from!.getTime()) {
        const local = to;
        to = from;
        from = local;
      }
      const yesterday = DateUtil.Yesterday();
      const historicalTo =
        nextUpdate && nextUpdate.getTime() > to!.getTime() // eslint-disable-line @typescript-eslint/no-non-null-assertion
          ? DateUtil.CleanHour(nextUpdate)
          : to!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      const performaceDate =
        historicalTo.getTime() > yesterday.getTime() ? yesterday : historicalTo;
      historicalPrice = historicalPrice.filter(
        (a: any) =>
          historicalTo!.getTime() >= new Date(a.date).getTime() && // eslint-disable-line @typescript-eslint/no-non-null-assertion
          from!.getTime() <= new Date(a.date).getTime() // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
      if (historicalPrice.length > 0) {
        let close: number | undefined = undefined;
        const closePrice = historicalPrice.filter(
          (a: any) => to!.getTime() >= new Date(a.date).getTime() // eslint-disable-line @typescript-eslint/no-non-null-assertion
        );
        if (closePrice && closePrice.length > 0) {
          close = closePrice[closePrice.length - 1].close;
        }
        let open = historicalPrice[0].open;
        let diff = close! - open; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        if (historicalPrice.length > 1) {
          open = historicalPrice[1].open;
          diff = close! - historicalPrice[0].close; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        }
        const percentage = (diff * 100) / open;
        let lowValue: number | undefined = undefined;
        let highValue: number | undefined = undefined;
        for (const price of historicalPrice) {
          if (lowValue === undefined || price.low < lowValue) {
            lowValue = price.low;
          }
          if (highValue === undefined || price.high > highValue) {
            highValue = price.high;
          }
        }
        let finalPerformance:
          | {
              date: Date;
              close: number;
              percentage: number;
            }
          | undefined = undefined;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (performaceDate.getTime() > to!.getTime()) {
          finalPerformance = {
            date: historicalPrice[historicalPrice.length - 1].date,
            close: historicalPrice[historicalPrice.length - 1].close,
            percentage:
              100 -
              (close! * 100) / historicalPrice[historicalPrice.length - 1].close // eslint-disable-line @typescript-eslint/no-non-null-assertion
          };
        }
        return new Performance(
          from!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          to!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          diff,
          percentage,
          0,
          open,
          close!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
          lowValue || 0,
          highValue || 0,
          finalPerformance,
          nextUpdate
        );
      }
    }
    return undefined;
  }
  public static Json(data: Performance | Performance[]): any[] {
    const result: any[] = [];
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        let previousPeriod: Performance | undefined = undefined;
        if (i > 0) {
          previousPeriod = data[i - 1];
        }
        const nextPeriod: Performance | undefined = undefined;
        if (i < data.length - 1) {
          previousPeriod = data[i + 1];
        }
        result.push(data[i].json(undefined, previousPeriod, nextPeriod));
      }
    } else {
      result.push(data.json());
    }
    return result;
  }
  public static calculateChanges(
    subPeriods: Performance[] | undefined = undefined
  ): Performance[] | undefined {
    if (subPeriods && subPeriods.length > 0) {
      if (subPeriods.length > 1) {
        subPeriods = subPeriods
          .sort((a: Performance, b: Performance) => b.diff - a.diff)
          .sort((a: Performance, b: Performance) => b.close - a.close)
          .sort((a: Performance, b: Performance) => b.percentage - a.percentage)
          .sort(
            (a: Performance, b: Performance) => a.to.getTime() - b.to.getTime()
          )
          .sort(
            (a: Performance, b: Performance) =>
              a.from.getTime() - b.from.getTime()
          );
      }
      for (let i = 0; i < subPeriods.length; i++) {
        if (i === 0 && subPeriods[i]) {
          subPeriods[i].change = subPeriods[i].percentage;
        } else if (i > 0 && subPeriods[i] && subPeriods[i - 1]) {
          subPeriods[i].change =
            subPeriods[i].percentage - subPeriods[i - 1].percentage;
        }
      }
    }
    return subPeriods;
  }
  private _from!: Date;
  private _to!: Date;
  private _diff!: number;
  private _percentage!: number;
  private _change!: number;
  private _open!: number;
  private _close!: number;
  private _low!: number;
  private _high!: number;
  private _finalPerformance!:
    | {
        date: Date;
        close: number;
      }
    | undefined;
  private _nextUpdate!: Date | undefined;
  constructor(
    from: Date,
    to: Date,
    diff: number,
    percentage: number,
    change: number,
    open: number,
    close: number,
    low: number,
    high: number,
    finalPerformance:
      | {
          date: Date;
          close: number;
        }
      | undefined = undefined,
    nextUpdate: Date | undefined = undefined
  ) {
    this.from = from;
    this.to = to;
    this.diff = diff;
    this.percentage = percentage;
    this.change = change;
    this.open = open;
    this.close = close;
    this.low = low;
    this.high = high;
    this.finalPerformance = finalPerformance;
    this.nextUpdate = nextUpdate;
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
  public get diff(): number {
    return this._diff;
  }
  public set diff(value: number) {
    this._diff = value;
  }
  public get percentage(): number {
    return this._percentage;
  }
  public set percentage(value: number) {
    this._percentage = value;
  }
  public get change(): number {
    return this._change;
  }
  public set change(value: number) {
    this._change = value;
  }
  public get open(): number {
    return this._open;
  }
  public set open(value: number) {
    this._open = value;
  }
  public get close(): number {
    return this._close;
  }
  public set close(value: number) {
    this._close = value;
  }
  public get low(): number {
    return this._low;
  }
  public set low(value: number) {
    this._low = value;
  }
  public get high(): number {
    return this._high;
  }
  public set high(value: number) {
    this._high = value;
  }
  public get finalPerformance():
    | {
        date: Date;
        close: number;
      }
    | undefined {
    return this._finalPerformance;
  }
  public set finalPerformance(
    value:
      | {
          date: Date;
          close: number;
        }
      | undefined
  ) {
    this._finalPerformance = value;
  }
  public get nextUpdate(): Date | undefined {
    return this._nextUpdate;
  }
  public set nextUpdate(value: Date | undefined) {
    this._nextUpdate = value;
  }
  public get candlestick(): CandlestickModel {
    return new CandlestickModel(this.open, this.close, this.low, this.high);
  }
  public json(
    subPeriods: Performance[] | undefined = undefined,
    previousPeriod: Performance | undefined = undefined,
    nextPeriod: Performance | undefined = undefined
  ): any {
    subPeriods = Performance.calculateChanges(subPeriods);
    let avgPct: number | undefined = undefined;
    let avgChg: number | undefined = undefined;
    let avgCandle: number | undefined = undefined;
    if (subPeriods) {
      let total = 0;
      avgPct = 0;
      avgChg = 0;
      avgCandle = 0;
      for (let i = 0; i < subPeriods.length; i++) {
        let addCandlestickValue = 0;
        if (i > 0) {
          if (
            subPeriods[i].candlestick.type === CandlestickModel.Type.HAMMER &&
            subPeriods[i - 1].candlestick.numericType < 0
          ) {
            addCandlestickValue++;
          } else if (
            subPeriods[i].candlestick.type ===
              CandlestickModel.Type.INVERTED_HAMMER &&
            subPeriods[i - 1].candlestick.numericType > 0
          ) {
            addCandlestickValue++;
          } else if (
            subPeriods[i].candlestick.type ===
              CandlestickModel.Type.HANGING_MAN &&
            subPeriods[i - 1].candlestick.numericType > 0
          ) {
            addCandlestickValue--;
          } else if (
            subPeriods[i].candlestick.type ===
              CandlestickModel.Type.INVERTED_HANGING_MAN &&
            subPeriods[i - 1].candlestick.numericType < 0
          ) {
            addCandlestickValue--;
          }
          if (
            subPeriods[i].candlestick.isEngulfing(
              subPeriods[i - 1].candlestick
            ) === true
          ) {
            if (
              subPeriods[i].candlestick.color === CandlestickModel.Color.GREEN
            ) {
              addCandlestickValue++;
            } else if (
              subPeriods[i].candlestick.color === CandlestickModel.Color.RED
            ) {
              addCandlestickValue--;
            }
          }
          if (
            subPeriods[i - 1] &&
            subPeriods[i].candlestick &&
            subPeriods[i].candlestick.isPiercingPattern(
              subPeriods[i - 1].candlestick
            ) === true
          ) {
            if (
              subPeriods[i].candlestick.color === CandlestickModel.Color.GREEN
            ) {
              addCandlestickValue++;
            } else if (
              subPeriods[i].candlestick.color === CandlestickModel.Color.RED
            ) {
              addCandlestickValue--;
            }
          }
          if (
            subPeriods[i + 1] &&
            subPeriods[i + 1].candlestick &&
            subPeriods[i - 1] &&
            subPeriods[i - 1].candlestick &&
            subPeriods[i].candlestick.isStart(
              subPeriods[i - 1].candlestick,
              subPeriods[i + 1].candlestick
            ) === true
          ) {
            if (
              subPeriods[i - 1].candlestick.color === CandlestickModel.Color.RED
            ) {
              addCandlestickValue++;
            } else if (
              subPeriods[i - 1].candlestick.color ===
              CandlestickModel.Color.GREEN
            ) {
              addCandlestickValue--;
            }
          }
        }
        avgPct += (subPeriods[i].percentage / subPeriods.length) * (i + 1);
        if (subPeriods[i].change > 0) {
          avgChg += (subPeriods[i].change / subPeriods.length) * (i + 1);
        }
        subPeriods[i].candlestick.extraValue = addCandlestickValue;
        avgCandle +=
          (subPeriods[i].candlestick.value / subPeriods.length) * (i + 1);
        total += (100 / subPeriods.length) * (i + 1);
      }
      avgPct = (avgPct / total) * 100;
      avgChg = (avgChg / total) * 100;
      avgCandle = (avgCandle / total) * 100;
    } else {
      avgPct = this.percentage;
      avgChg = this.change;
      avgCandle = this.change;
    }
    return {
      from: this.from,
      to: this.to,
      open: this.open,
      close: this.close,
      low: this.low,
      high: this.high,
      diff: this.diff,
      candlestick: this.candlestick.json(
        previousPeriod?.candlestick,
        nextPeriod?.candlestick
      ),
      percentage: this.percentage,
      change: this.change,
      avgPct: avgPct,
      avgChg: avgChg ? avgChg : undefined,
      avgCandle: avgCandle ? avgCandle : undefined,
      subPeriods:
        !subPeriods || subPeriods.length < 2
          ? undefined
          : Performance.Json(subPeriods),
      finalPerformance: this.finalPerformance,
      nextUpdate: this.nextUpdate
    };
  }
}
