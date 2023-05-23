import { Configuration as ConfigurationUtil } from '../../domain/util/configuration.util';

export class QueryRequest {
  public static GetValue(requestValue: any): string {
    let fmpApiKey: string | undefined = undefined;
    if (requestValue) {
      if (
        requestValue instanceof Array &&
        typeof requestValue[0] === 'string'
      ) {
        fmpApiKey = requestValue[0].trim();
      } else if (typeof requestValue === 'string') {
        fmpApiKey = requestValue.trim();
      }
    }
    return ConfigurationUtil.FmpApiKey(fmpApiKey);
  }
  public static GetFmpApiKey(requestValue: any): string {
    return ConfigurationUtil.FmpApiKey(QueryRequest.GetValue(requestValue));
  }
}
