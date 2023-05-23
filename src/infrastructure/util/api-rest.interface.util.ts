export interface ApiRest {
  get method(): string;
  set method(value: string | undefined);
  get url(): string;
  set url(value: string);
  get json(): object;
  exe(): any;
}
