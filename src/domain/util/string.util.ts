export class StringUtil {
  public static TrimAndCheckEmpty(
    value: string | undefined,
    defaultValue: string | undefined = undefined
  ): string | undefined {
    const trimmedValue = (value || '').trim();
    return trimmedValue.length === 0 ? defaultValue?.trim() : trimmedValue;
  }
  public static TrimOrReplace(
    value: string | undefined,
    defaultValue = ''
  ): string {
    const trimmedValue = (value || '').trim();
    return trimmedValue.length === 0 ? defaultValue.trim() : trimmedValue;
  }
}
