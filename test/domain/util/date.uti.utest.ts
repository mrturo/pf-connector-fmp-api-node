import { DateUtil } from '../../../src/domain/util/date.util';

describe('Class DateUtil', () => {
  it('SetDate - Happy Path 1', async () => {
    expect(DateUtil.SetDate()).toStrictEqual(DateUtil.Today());
  });
  it('SetDate - Happy Path 2', async () => {
    expect(DateUtil.SetDate('2020-01-01')?.toString()).toBe(
      DateUtil.SetDate(new Date(2020, 0, 1)).toString()
    );
  });
  it('SetDate - Happy Path 3', async () => {
    const today = DateUtil.Today();
    expect(DateUtil.SetDate(today)).toStrictEqual(
      DateUtil.CleanHour(
        new Date(today.getFullYear(), today.getMonth(), today.getDate())
      )
    );
  });
  it('SetDate - Happy Path 4', async () => {
    const today = DateUtil.Today();
    expect(
      DateUtil.SetDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)
      )
    ).toStrictEqual(
      DateUtil.CleanHour(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      )
    );
  });
  it('PrevBusinessDay - 1', async () => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const prevBusinessDay = DateUtil.PrevBusinessDay(); // eslint-disable-line @typescript-eslint/no-unused-vars
    expect(DateUtil.PrevBusinessDay(new Date(2023, 5, 20))).toStrictEqual(
      DateUtil.CleanHour(new Date(2023, 5, 19))
    );
  });
  it('PrevBusinessDay - 2', async () => {
    expect(DateUtil.PrevBusinessDay(new Date(2023, 5, 19))).toStrictEqual(
      DateUtil.CleanHour(new Date(2023, 5, 16))
    );
  });
  it('PrevBusinessDay - 3', async () => {
    expect(DateUtil.PrevBusinessDay(new Date(2023, 5, 18))).toStrictEqual(
      DateUtil.CleanHour(new Date(2023, 5, 16))
    );
  });
  it('PrevBusinessDay - 4', async () => {
    expect(DateUtil.PrevBusinessDay(new Date(2023, 5, 17))).toStrictEqual(
      DateUtil.CleanHour(new Date(2023, 5, 16))
    );
  });
  it('PrevBusinessDay - 5', async () => {
    expect(DateUtil.PrevBusinessDay(new Date(2023, 5, 16))).toStrictEqual(
      DateUtil.CleanHour(new Date(2023, 5, 15))
    );
  });
});
