export class Symbol {
  public static SplittedString(symbol: string): string[] {
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
  public static GetSymbol(symbol: string | string[] | undefined): string[] {
    if (symbol && typeof symbol === 'string') {
      const splittedSymbol: string[] = Symbol.SplittedString(symbol);
      if (splittedSymbol.length === 1) {
        return splittedSymbol;
      } else {
        return Symbol.GetSymbol(splittedSymbol);
      }
    } else if (
      symbol &&
      Array.isArray(symbol) === true &&
      symbol.length > 0 &&
      typeof symbol[0] === 'string'
    ) {
      let result: string[] = [];
      for (const values of symbol) {
        result = result.concat(Symbol.GetSymbol(values));
      }
      return [...new Set(result)].sort();
    } else {
      return [];
    }
  }
  public static GetSymbolString(symbol: string | string[]): string {
    return Symbol.GetSymbol(symbol).join(',');
  }
  public static ChunkSymbol(
    symbols: string | string[],
    chunkSize: number
  ): string[][] {
    const chunkedArray: string[][] = [];
    let index = 0;
    symbols = Symbol.GetSymbol(symbols);
    while (index < symbols.length) {
      chunkedArray.push(symbols.slice(index, index + chunkSize));
      index += chunkSize;
    }
    return chunkedArray;
  }
  public static ChunkSymbolString(
    symbols: string | string[],
    chunkSize: number
  ): string[] {
    const result = [];
    const chunkeSymbols = Symbol.ChunkSymbol(symbols, chunkSize);
    for (const chunk of chunkeSymbols) {
      result.push(chunk.join(','));
    }
    return result;
  }
}
