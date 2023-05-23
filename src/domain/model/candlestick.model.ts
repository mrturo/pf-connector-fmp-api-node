enum CandlestickColor {
  GREEN = 'GREEN',
  RED = 'RED',
  GRAY = 'GRAY'
}
enum CandlestickType {
  DOJI = 'DOJI',
  HAMMER = 'HAMMER',
  INVERTED_HAMMER = 'INVERTED_HAMMER',
  BULL = 'BULL',
  HANGING_MAN = 'HANGING_MAN',
  INVERTED_HANGING_MAN = 'INVERTED_HANGING_MAN',
  BEAR = 'BEAR'
}
export class Candlestick {
  public static readonly Color = CandlestickColor;
  public static readonly Type = CandlestickType;
  private _open!: number;
  private _close!: number;
  private _low!: number;
  private _high!: number;
  private _extraValue!: number;
  constructor(open: number, close: number, low: number, high: number) {
    this.open = open;
    this.close = close;
    this.low = low;
    this.high = high;
    this.extraValue = 0;
  }
  public isEngulfing(previousCandlestick: Candlestick): boolean {
    const previousFloor = Math.min(
      previousCandlestick.open,
      previousCandlestick.close
    );
    const previousCeil = Math.max(
      previousCandlestick.open,
      previousCandlestick.close
    );
    const thisFloor = Math.min(this.open, this.close);
    const thisCeil = Math.max(this.open, this.close);
    return (
      previousCandlestick.color !== Candlestick.Color.GRAY &&
      this.color !== Candlestick.Color.GRAY &&
      previousCandlestick.color !== this.color &&
      (previousFloor !== thisFloor || previousCeil !== thisCeil) &&
      thisFloor <= previousFloor &&
      thisCeil >= previousCeil
    );
  }
  public isPiercingPattern(previousCandlestick: Candlestick): boolean {
    const previousFloor = Math.min(
      previousCandlestick.open,
      previousCandlestick.close
    );
    const previousCeil = Math.max(
      previousCandlestick.open,
      previousCandlestick.close
    );
    const thisFloor = Math.min(this.open, this.close);
    const thisCeil = Math.max(this.open, this.close);
    if (
      this.color === Candlestick.Color.GREEN &&
      [`${Candlestick.Color.RED}`, `${Candlestick.Color.GRAY}`].includes(
        `${previousCandlestick.color}`
      ) === true
    ) {
      return thisFloor > previousCeil;
    } else if (
      this.color === Candlestick.Color.RED &&
      [`${Candlestick.Color.GREEN}`, `${Candlestick.Color.GRAY}`].includes(
        `${previousCandlestick.color}`
      ) === true
    ) {
      return thisCeil < previousFloor;
    }
    return false;
  }
  public isStart(
    previousCandlestick: Candlestick,
    nextCandlestick: Candlestick
  ): boolean {
    if (
      (previousCandlestick.color === Candlestick.Color.RED &&
        nextCandlestick.color === Candlestick.Color.GREEN &&
        previousCandlestick.body > this.body &&
        nextCandlestick.body > this.body) ||
      (previousCandlestick.color === Candlestick.Color.GREEN &&
        nextCandlestick.color === Candlestick.Color.RED &&
        previousCandlestick.body > this.body &&
        nextCandlestick.body > this.body)
    ) {
      return true;
    }
    return false;
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
  public get extraValue(): number {
    return this._extraValue;
  }
  public set extraValue(value: number) {
    this._extraValue = value;
  }
  public get color(): string {
    return this.open > this.close
      ? Candlestick.Color.RED
      : this.open < this.close
      ? Candlestick.Color.GREEN
      : Candlestick.Color.GRAY;
  }
  public get complete(): number {
    return Math.abs(this.low - this.high);
  }
  public get body(): number {
    return this.complete === 0
      ? 0
      : Math.abs(this.open - this.close) / this.complete;
  }
  public get upperShadow(): number {
    return this.complete === 0
      ? 0
      : (this.high - Math.max(this.open, this.close)) / this.complete;
  }
  public get lowerShadow(): number {
    return this.complete === 0
      ? 0
      : (Math.min(this.open, this.close) - this.low) / this.complete;
  }
  public get bodyCenter(): number {
    return this.complete === 0
      ? 0
      : ((this.open + this.close) / 2 - this.low) / this.complete;
  }
  public get type(): string {
    const center = 0.3;
    const upperCenter = 0.5 + center;
    const lowerCenter = 0.5 - center;
    const extremistSize = 0.15;
    let result = Candlestick.Type.DOJI;
    if (this.color === Candlestick.Color.GREEN) {
      result =
        this.bodyCenter > upperCenter &&
        this.lowerShadow > this.upperShadow &&
        this.upperShadow < extremistSize
          ? Candlestick.Type.HAMMER
          : this.bodyCenter < lowerCenter &&
            this.upperShadow > this.lowerShadow &&
            this.lowerShadow < extremistSize
          ? Candlestick.Type.INVERTED_HAMMER
          : Candlestick.Type.BULL;
    } else if (this.color === Candlestick.Color.RED) {
      result =
        this.bodyCenter > upperCenter &&
        this.lowerShadow > this.upperShadow &&
        this.upperShadow < extremistSize
          ? Candlestick.Type.HANGING_MAN
          : this.bodyCenter < lowerCenter &&
            this.upperShadow > this.lowerShadow &&
            this.lowerShadow < extremistSize
          ? Candlestick.Type.INVERTED_HANGING_MAN
          : Candlestick.Type.BEAR;
    }
    return result;
  }
  public get numericType(): number {
    const type = this.type;
    return [
      Candlestick.Type.HAMMER.toString(),
      Candlestick.Type.INVERTED_HAMMER.toString()
    ].includes(type) === true
      ? 2
      : [Candlestick.Type.BULL.toString()].includes(type) === true
      ? 1
      : [
          Candlestick.Type.HANGING_MAN.toString(),
          Candlestick.Type.INVERTED_HANGING_MAN.toString()
        ].includes(type) === true
      ? -2
      : [Candlestick.Type.BEAR.toString()].includes(type) === true
      ? -1
      : 0;
  }
  public get value(): number {
    const numericType = this.numericType + this.extraValue;
    const factor =
      this.bodyCenter > 0.5 ? this.bodyCenter : 1 - this.bodyCenter;
    return numericType * factor;
  }
  public get isHammer(): boolean {
    const type = this.type;
    return [
      Candlestick.Type.HAMMER.toString(),
      Candlestick.Type.INVERTED_HAMMER.toString()
    ].includes(type);
  }
  public get isHangingMan(): boolean {
    const type = this.type;
    return [
      Candlestick.Type.HANGING_MAN.toString(),
      Candlestick.Type.INVERTED_HANGING_MAN.toString()
    ].includes(type);
  }
  public json(
    previousCandlestick: Candlestick | undefined = undefined,
    nextCandlestick: Candlestick | undefined = undefined
  ): any {
    return {
      color: this.color,
      value: this.value,
      upperShadow: this.upperShadow,
      body: this.body,
      bodyCenter: this.bodyCenter,
      lowerShadow: this.lowerShadow,
      type: this.type,
      numericType: this.numericType,
      isHammer: this.isHammer,
      isHangingMan: this.isHangingMan,
      isEngulfing: previousCandlestick
        ? this.isEngulfing(previousCandlestick)
        : undefined,
      isPiercingPattern: previousCandlestick
        ? this.isPiercingPattern(previousCandlestick)
        : undefined,
      isStart:
        previousCandlestick && nextCandlestick
          ? this.isStart(previousCandlestick, nextCandlestick)
          : undefined
    };
  }
}
