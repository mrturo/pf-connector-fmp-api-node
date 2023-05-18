import { Symbol as SymbolUtil } from '../../../src/application/util/symbol.util';

describe('Class Symbol Util', () => {
  it('getSymbol - Happy Path', async () => {
    expect(SymbolUtil.getSymbol(['a', 'B', 'b,c'])).toEqual(['A', 'B', 'C']);
  });
  it('getSymbolString - Happy Path', async () => {
    expect(SymbolUtil.getSymbolString(['a', 'B', 'b,c'])).toBe('A,B,C');
  });
});
