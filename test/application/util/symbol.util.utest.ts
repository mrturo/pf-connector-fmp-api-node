import { Symbol as SymbolUtil } from '../../../src/application/util/symbol.util';

describe('Class Symbol Util', () => {
  it('GetSymbol - Happy Path', async () => {
    expect(SymbolUtil.GetSymbol(undefined)).toEqual([]);
    expect(SymbolUtil.GetSymbol(['a', 'B', 'b,c'])).toEqual(['A', 'B', 'C']);
  });
  it('GetSymbolString - Happy Path', async () => {
    expect(SymbolUtil.GetSymbolString(['a', 'B', 'b,c'])).toBe('A,B,C');
  });
  it('chunkSymbol - Happy Path 1', async () => {
    expect(SymbolUtil.ChunkSymbol(['a', 'B', 'c', 'C'], 2)).toEqual([
      ['A', 'B'],
      ['C']
    ]);
  });
  it('chunkSymbol - Happy Path 2', async () => {
    expect(SymbolUtil.ChunkSymbol(['a'], 2)).toEqual([['A']]);
  });
  it('chunkSymbol - Happy Path 3', async () => {
    expect(SymbolUtil.ChunkSymbol('a', 2)).toEqual([['A']]);
  });
  it('chunkSymbolString - Happy Path 1', async () => {
    expect(SymbolUtil.ChunkSymbolString(['a', 'B', 'c', 'C'], 2)).toEqual([
      'A,B',
      'C'
    ]);
  });
  it('chunkSymbolString - Happy Path 2', async () => {
    expect(SymbolUtil.ChunkSymbolString(['a'], 2)).toEqual(['A']);
  });
  it('chunkSymbolString - Happy Path 3', async () => {
    expect(SymbolUtil.ChunkSymbolString('a', 2)).toEqual(['A']);
  });
});
