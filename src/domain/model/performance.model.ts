export class Performance {
  public static buildFromHistory(
    historicalPrice: any,
    from: Date | undefined = undefined,
    to: Date | undefined = undefined
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
        from = new Date(historicalPrice[0].date);
        to = new Date(historicalPrice[historicalPrice.length - 1].date);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (!from && to) {
        from = new Date(to);
        to = new Date(to);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      } else if (from && !to) {
        from = new Date(from);
        to = new Date(from);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (to!.getTime() < from!.getTime()) {
        const local = to;
        to = from;
        from = local;
      }
      historicalPrice = historicalPrice.filter(
        (a: any) =>
          to!.getTime() >= new Date(a.date).getTime() && // eslint-disable-line @typescript-eslint/no-non-null-assertion
          from!.getTime() <= new Date(a.date).getTime() // eslint-disable-line @typescript-eslint/no-non-null-assertion
      );
      if (historicalPrice.length > 0) {
        let diff = 0;
        let percentage = 0;
        const price: number = historicalPrice[historicalPrice.length - 1].close;
        if (historicalPrice.length === 1) {
          diff = price - historicalPrice[0].open;
          percentage = (diff * 100) / historicalPrice[0].open;
        } else {
          diff = price - historicalPrice[0].close;
          percentage = (diff * 100) / historicalPrice[0].close;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return new Performance(from!, to!, diff, percentage, price);
      }
    }
    return undefined;
  }
  public static json(data: Performance | Performance[]): any[] {
    let result: any[] = [];
    if (Array.isArray(data)) {
      for (const d of data) {
        result.push(d.json());
      }
    } else {
      result.push(data.json());
    }
    result = result.sort((a: any, b: any) => b.diff - a.diff);
    result = result.sort((a: any, b: any) => b.price - a.price);
    result = result.sort((a: any, b: any) => b.percentage - a.percentage);
    result = result.sort((a: any, b: any) => a.to.getTime() - b.to.getTime());
    return result.sort((a: any, b: any) => a.from.getTime() - b.from.getTime());
  }
  private _from!: Date;
  private _to!: Date;
  private _diff!: number;
  private _percentage!: number;
  private _price!: number;
  constructor(
    from: Date,
    to: Date,
    diff: number,
    percentage: number,
    price: number
  ) {
    this.from = from;
    this.to = to;
    this.diff = diff;
    this.percentage = percentage;
    this.price = price;
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
  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }
  public json(subPeriods: Performance[] | undefined = undefined) {
    return {
      from: this.from,
      to: this.to,
      price: this.price,
      diff: this.diff,
      percentage: this.percentage,
      subPeriods:
        !subPeriods || subPeriods.length < 2
          ? undefined
          : Performance.json(subPeriods)
    };
  }
}
