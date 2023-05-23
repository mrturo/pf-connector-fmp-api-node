import { Symbol as SymbolUtil } from '../../../src/application/util/symbol.util';

describe('Class Symbol Util', () => {
  it('getSymbol - Happy Path', async () => {
    expect(SymbolUtil.getSymbol(['a', 'B', 'b,c'])).toEqual(['A', 'B', 'C']);
  });
  it('getSymbolString - Happy Path', async () => {
    expect(SymbolUtil.getSymbolString(['a', 'B', 'b,c'])).toBe('A,B,C');
  });
  it('chunkSymbol - Happy Path 1', async () => {
    expect(SymbolUtil.chunkSymbol(['a', 'B', 'c', 'C'], 2)).toEqual([
      ['A', 'B'],
      ['C']
    ]);
  });
  it('chunkSymbol - Happy Path 2', async () => {
    expect(SymbolUtil.chunkSymbol(['a'], 2)).toEqual([['A']]);
  });
  it('chunkSymbol - Happy Path 3', async () => {
    expect(SymbolUtil.chunkSymbol('a', 2)).toEqual([['A']]);
  });
  it('chunkSymbolString - Happy Path 1', async () => {
    expect(SymbolUtil.chunkSymbolString(['a', 'B', 'c', 'C'], 2)).toEqual([
      'A,B',
      'C'
    ]);
  });
  it('chunkSymbolString - Happy Path 2', async () => {
    expect(SymbolUtil.chunkSymbolString(['a'], 2)).toEqual(['A']);
  });
  it('chunkSymbolString - Happy Path 3', async () => {
    expect(SymbolUtil.chunkSymbolString('a', 2)).toEqual(['A']);
  });
});
