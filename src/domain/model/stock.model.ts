import { round } from 'mathjs';
import { Symbol as SymbolUtil } from '../../application/util/symbol.util';
import { Domain as DomainError } from '../error/domain.error';
import { StringUtil } from '../util/string.util';

export enum StockType {
  COMPANY = 'COMPANY',
  ETF = 'ETF',
  MUTUAL_FUND = 'MUTUAL_FUND',
  UNKNOWN = 'UNKNOWN'
}
export class Stock {
  public static readonly Type = StockType;
  public static Json(
    array: Stock[],
    rateUSD: number | undefined = undefined
  ): {
    symbol: string;
    name: string | undefined;
    type: string | undefined;
    sector: string | undefined;
    industry: string | undefined;
    quantity: number;
    unitPriceUSD: number;
    amountUSD: number;
    amountLocal: number | undefined;
    percentage: number | undefined;
  }[] {
    return array.map((a) => a.json(rateUSD));
  }
  private _industry!: string | undefined;
  private _name!: string | undefined;
  private _quantity!: number;
  private _sector!: string | undefined;
  private _symbol!: string;
  private _type!: string | undefined;
  private _unitPriceUSD!: number;
  constructor(symbol: string, quantity: number | undefined = undefined) {
    this.industry = undefined;
    this.name = undefined;
    this.quantity = quantity;
    this.sector = undefined;
    this.symbol = symbol;
    this.type = undefined;
    this.unitPriceUSD = undefined;
  }
  public amountLocal(
    rateUSD: number | undefined = undefined
  ): number | undefined {
    return rateUSD ? round(rateUSD * this.amountUSD, 0) : undefined;
  }
  public get amountUSD(): number {
    return this.unitPriceUSD * this.quantity;
  }
  public get industry(): string | undefined {
    return this._industry;
  }
  public set industry(value: string | undefined) {
    this._industry = StringUtil.TrimAndCheckEmpty(value);
  }
  public json(
    rateUSD: number | undefined = undefined,
    totalAmountUSD: number | undefined = undefined
  ): {
    symbol: string;
    name: string | undefined;
    type: string | undefined;
    sector: string | undefined;
    industry: string | undefined;
    quantity: number;
    unitPriceUSD: number;
    amountUSD: number;
    amountLocal: number | undefined;
    percentage: number | undefined;
  } {
    const localType = StringUtil.TrimAndCheckEmpty(
      this.type,
      StockType[StockType.COMPANY]
    );
    return {
      symbol: this.symbol.trim().toUpperCase(),
      name: StringUtil.TrimAndCheckEmpty(this.name?.toUpperCase()),
      type: localType,
      sector: StringUtil.TrimAndCheckEmpty(
        this.sector?.toUpperCase(),
        localType
      ),
      industry: StringUtil.TrimAndCheckEmpty(
        this.industry?.toUpperCase(),
        localType
      ),
      quantity: this.quantity,
      unitPriceUSD: round(this.unitPriceUSD, 2),
      amountUSD: round(this.amountUSD, 2),
      amountLocal: this.amountLocal(rateUSD),
      percentage: this.percentage(totalAmountUSD)
    };
  }
  public get name(): string | undefined {
    return this._name;
  }
  public set name(value: string | undefined) {
    this._name = StringUtil.TrimAndCheckEmpty(value);
  }
  public percentage(
    totalAmountUSD: number | undefined = undefined
  ): number | undefined {
    let result: number | undefined = undefined;
    if (totalAmountUSD) {
      result = round((this.amountUSD / totalAmountUSD) * 100, 2);
    }
    return result;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public set quantity(value: number | undefined) {
    value = value || 1;
    if (value <= 0) {
      throw new DomainError(
        `Stock quantity must be greater or equal than zero: ${value}`
      );
    }
    this._quantity = value;
  }
  public get sector(): string | undefined {
    return this._sector;
  }
  public set sector(value: string | undefined) {
    this._sector = StringUtil.TrimAndCheckEmpty(value);
  }
  public get symbol(): string {
    return this._symbol;
  }
  public set symbol(value: string) {
    const splittedValue: string[] = SymbolUtil.GetSymbol(value);
    if (splittedValue.length !== 1) {
      throw new DomainError(`Invalid symbol: ${value}`);
    }
    this._symbol = splittedValue[0];
  }
  public get type(): string | undefined {
    return this._type;
  }
  public set type(value: string | undefined) {
    this._type = StringUtil.TrimAndCheckEmpty(
      value?.toUpperCase(),
      `${Stock.Type[Stock.Type.COMPANY]}`
    );
    if (
      [
        `${Stock.Type[Stock.Type.COMPANY]}`,
        `${Stock.Type[Stock.Type.ETF]}`,
        `${Stock.Type[Stock.Type.MUTUAL_FUND]}`,
        `${Stock.Type[Stock.Type.UNKNOWN]}`
      ].includes(StringUtil.TrimOrReplace(this._type)) === false
    ) {
      throw new DomainError(`Invalid stock type: ${value}`);
    }
  }
  public get unitPriceUSD(): number {
    return this._unitPriceUSD;
  }
  public set unitPriceUSD(value: number | undefined) {
    value = value || 1;
    if (value < 0) {
      throw new DomainError(
        `Stock unit price must be greater or equal than zero: ${value}`
      );
    }
    this._unitPriceUSD = value;
  }
}
