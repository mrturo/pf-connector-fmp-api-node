import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';
import { Environment as EnvironmentUtil } from '../../../src/domain/util/environment.util';
EnvironmentUtil.DEVELOPMENT();

describe('Class Configuration', () => {
  it('Happy Path', async () => {
    expect(ConfigurationUtil.PackageName()).not.toBe('');
    expect(ConfigurationUtil.PackageName()).not.toBeNull();
    expect(ConfigurationUtil.PackageName()).not.toBeUndefined();
    expect(ConfigurationUtil.FmpApiKey('Hola')).toBe('Hola');
    expect(ConfigurationUtil.Port()).toBeGreaterThan(0);
    expect(ConfigurationUtil.IsTrue('')).toBe(true);
    expect(ConfigurationUtil.IsTrue('N')).toBe(false);
    expect(ConfigurationUtil.IsTrue('S')).toBe(true);
    expect(ConfigurationUtil.IsTrue('SI')).toBe(true);
    expect(ConfigurationUtil.IsTrue('T')).toBe(true);
    expect(ConfigurationUtil.IsTrue('TRUE')).toBe(true);
    expect(ConfigurationUtil.IsTrue('V')).toBe(true);
    expect(ConfigurationUtil.IsTrue('VERDADERO')).toBe(true);
    expect(ConfigurationUtil.IsTrue('Y')).toBe(true);
    expect(ConfigurationUtil.IsTrue('YES')).toBe(true);
    ConfigurationUtil.ShowValues();
    const conf = new ConfigurationUtil('${test}');
    expect(conf.value).toBe('');
  });
  it('Invalid configuration', async () => {
    const conf: ConfigurationUtil = new ConfigurationUtil();
    expect(conf.value).toBe('');
  });
  it('Get numeric value from string', async () => {
    expect(ConfigurationUtil.ValueToNumber(new ConfigurationUtil('h'))).toBe(0);
    expect(ConfigurationUtil.ValueToNumber(new ConfigurationUtil('1'))).toBe(1);
  });
  it('Get date value from string', async () => {
    expect(
      ConfigurationUtil.ValueToDate(new ConfigurationUtil('20220110'))
    ).toStrictEqual(new Date(2022, 0, 10, 0, 0, 0, 0));
    expect(
      ConfigurationUtil.ValueToDate(new ConfigurationUtil(''))
    ).toBeUndefined();
    expect(
      ConfigurationUtil.ValueToDate(new ConfigurationUtil('ABCDEFGH'))
    ).toBeUndefined();
  });
  it('HideCharacters', async () => {
    expect(ConfigurationUtil.HideCharacters('Hola')).toBe('****');
  });
});
