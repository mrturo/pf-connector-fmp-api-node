export class Symbol {
  public static splittedString(symbol: string): string[] {
    const result: string[] = [];
    const splittedValue: string[] = symbol
      .toUpperCase()
      .split(',')
      .filter((s) => s.trim().length > 0);
    for (const v of splittedValue) {
      result.push(v.trim());
    }
    return [...new Set(result)].sort();
  }
  public static getSymbol(symbol: string | string[]): string[] {
    if (typeof symbol === 'string') {
      const splittedSymbol: string[] = Symbol.splittedString(symbol);
      if (splittedSymbol.length === 1) {
        return splittedSymbol;
      } else {
        return Symbol.getSymbol(splittedSymbol);
      }
    } else {
      let result: string[] = [];
      for (const values of symbol) {
        result = result.concat(Symbol.getSymbol(values));
      }
      return [...new Set(result)].sort();
    }
  }
  public static getSymbolString(symbol: string | string[]): string {
    return Symbol.getSymbol(symbol).join(',');
  }
  public static chunkSymbol(
    symbols: string | string[],
    chunkSize: number
  ): string[][] {
    const chunkedArray: string[][] = [];
    let index = 0;
    symbols = Symbol.getSymbol(symbols);
    while (index < symbols.length) {
      chunkedArray.push(symbols.slice(index, index + chunkSize));
      index += chunkSize;
    }
    return chunkedArray;
  }
  public static chunkSymbolString(
    symbols: string | string[],
    chunkSize: number
  ): string[] {
    const result = [];
    const chunkeSymbols = Symbol.chunkSymbol(symbols, chunkSize);
    for (const chunk of chunkeSymbols) {
      result.push(chunk.join(','));
    }
    return result;
  }
}
