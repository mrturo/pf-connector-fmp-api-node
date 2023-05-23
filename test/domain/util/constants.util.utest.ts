import { Constants as ConstantsUtil } from '../../../src/domain/util/constants.util';

describe('Class Constants', () => {
  it('Happy Path', async () => {
    expect(ConstantsUtil.FMP_HOSTNAME()).toBe('financialmodelingprep.com');
    expect(ConstantsUtil.FMP_BASE_URL()).toBe(
      'https://financialmodelingprep.com/api/v3/'
    );
    expect(ConstantsUtil.BACKUP_BASE_PATH()).toBe('backup\\');
    for (const array of [
      ConstantsUtil.VANGUARD_ETF(),
      ConstantsUtil.BLACKROCK_ETF(),
      ConstantsUtil.STATE_STREET_GLOBAL_ADVISORS_ETF(),
      ConstantsUtil.INVESCO_ETF(),
      ConstantsUtil.CHARLES_SCHWAB_ETF()
    ]) {
      expect(Array.isArray(array)).toBeTruthy();
      expect(array.length).toBeGreaterThan(0);
      expect(typeof array[0]).toBe('string');
    }
  });
});
