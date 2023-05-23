import { Domain as DomainError } from '../error/domain.error';
import { Environment as EnvironmentUtil } from './environment.util';
import { Logger as LoggerUtil } from './logger.util';
import { Random as RandomUtil } from './random.util';

export class Configuration {
  public static ValueToDate(c: Configuration): Date | undefined {
    let result: Date | undefined = undefined;
    const sDate = c.value;
    try {
      if (sDate.length === 8) {
        let year = parseInt(sDate.substring(0, 4));
        year = Number.isNaN(year) ? -1 : year;
        let month = parseInt(sDate.substring(4, 6));
        month = Number.isNaN(month) ? -1 : month;
        let day = parseInt(sDate.substring(6, 8));
        day = Number.isNaN(day) ? -1 : day;
        if (year < 0 || month < 0 || day < 0) {
          throw new DomainError('Invalid date values');
        }
        result = new Date(year, month - 1, day, 0, 0, 0, 0);
      } else {
        throw new DomainError(`Invalid date length (${sDate.length})`);
      }
    } catch (error) {
      // Empty block statement
    }
    return result;
  }
  public static ValueToNumber(c: Configuration, def = 0): number {
    const parsed = parseInt(c.value);
    return Number.isNaN(parsed) ? def : parsed;
  }
  public static HideCharacters(s: string): string {
    return '*'.repeat(s.length);
  }
  public static IsTrue(value: string): boolean {
    return (
      value === '' ||
      value === 'YES' ||
      value === 'Y' ||
      value === 'TRUE' ||
      value === 'T' ||
      value === 'SI' ||
      value === 'S' ||
      value === 'VERDADERO' ||
      value === 'V'
    );
  }
  public static NodeEnv(): string {
    return new Configuration(process.env.NODE_ENV).value;
  }
  public static PackageName(): string {
    return new Configuration(process.env.npm_package_name).value;
  }
  public static Port(): number {
    return Configuration.ValueToNumber(
      new Configuration(process.env.Port),
      3000
    );
  }
  public static FmpApiKey(value: string | undefined = undefined): string {
    if (value && typeof value === 'string' && value.trim().length > 0) {
      return new Configuration(value.trim()).value;
    }
    return new Configuration(process.env.FMP_APIKEY).value;
  }
  public static ShowValues(
    preLog: number | string | undefined | null = undefined
  ): void {
    preLog = RandomUtil.Get(preLog);
    const currentEnv: EnvironmentUtil = EnvironmentUtil.Init();
    LoggerUtil.debug([
      preLog,
      `Environment Variables: ${Configuration.PackageName()} (${
        currentEnv.value
      } - ${currentEnv.file})`
    ]);
    LoggerUtil.debug([
      preLog,
      ` * fmpApiKey: ${Configuration.HideCharacters(Configuration.FmpApiKey())}`
    ]);
    LoggerUtil.debug([preLog, ` * nodeEnv: ${Configuration.NodeEnv()}`]);
    LoggerUtil.debug([preLog, ` * port: ${Configuration.Port()}`]);
  }
  private _value!: string;
  constructor(value: string | null | undefined = undefined) {
    this.value = value;
  }
  public get value(): string {
    return this._value;
  }
  private set value(value: string | null | undefined) {
    this._value =
      !value ||
      value === null ||
      (typeof value === 'string' &&
        value.startsWith('${') === true &&
        value.endsWith('}') === true)
        ? ''
        : value.trim();
  }
}
