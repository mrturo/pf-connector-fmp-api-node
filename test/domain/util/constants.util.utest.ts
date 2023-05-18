import { Constants as ConstantsUtil } from '../../../src/domain/util/constants.util';

describe('Class Constants', () => {
  it('Happy Path', async () => {
    expect(ConstantsUtil.FMP_HOSTNAME()).toBe('financialmodelingprep.com');
    expect(ConstantsUtil.FMP_BASE_URL()).toBe(
      'https://financialmodelingprep.com/api/v3/'
    );
  });
});
