import { StringUtil } from '../../../src/domain/util/string.util';

describe('Class String', () => {
  it('Happy Path - TrimAndCheckEmpty', async () => {
    expect(StringUtil.TrimAndCheckEmpty(undefined)).toBeUndefined();
    expect(StringUtil.TrimAndCheckEmpty('')).toBeUndefined();
    expect(StringUtil.TrimAndCheckEmpty('', '')).toBe('');
    expect(StringUtil.TrimAndCheckEmpty('A')).toBe('A');
    expect(StringUtil.TrimAndCheckEmpty('A ')).toBe('A');
    expect(StringUtil.TrimAndCheckEmpty('A', 'B')).toBe('A');
    expect(StringUtil.TrimAndCheckEmpty('A ', 'B ')).toBe('A');
    expect(StringUtil.TrimAndCheckEmpty(' ', 'B ')).toBe('B');
  });
  it('Happy Path - Trim', async () => {
    expect(StringUtil.TrimOrReplace(undefined)).toBe('');
    expect(StringUtil.TrimOrReplace('')).toBe('');
    expect(StringUtil.TrimOrReplace('', '')).toBe('');
    expect(StringUtil.TrimOrReplace('', ' ')).toBe('');
    expect(StringUtil.TrimOrReplace('A')).toBe('A');
    expect(StringUtil.TrimOrReplace('A ')).toBe('A');
    expect(StringUtil.TrimOrReplace('A', 'B')).toBe('A');
    expect(StringUtil.TrimOrReplace('A ', 'B ')).toBe('A');
    expect(StringUtil.TrimOrReplace(' ', 'B ')).toBe('B');
    expect(StringUtil.TrimOrReplace(' ', 'B')).toBe('B');
  });
});
