export default class ApiResponse {
  private _body: any;
  private _status: number;
  private _headers: [];
  private _cacheHeader: string | null;

  constructor({
    body,
    status,
    headers,
              }: {
    body?: any;
    status?: number;
    headers?: [];
  } = {}) {
    this._body = body ?? null;
    this._status = status ?? 200;
    this._headers = headers ?? [];
    this._cacheHeader = null;
  }

  static error(message: string, code = 500) {
    return new ApiResponse({body: {error: message}, status: code});
  }

  body(value: any) {
    this._body = value;

    return this;
  }

  status(value: number) {
    this._status = value;

    return this;
  }

  headers(value: []) {
    this._headers.push(...value);

    return this;
  }

  cache(maxAge: number, staleWhileRevalidate: number) {
    this._cacheHeader = `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;

    return this;
  }

  getBody() {
    return this._body;
  }

  getStatus(): number {
    return this._status;
  }

  getHeaders(): [] {
    return this._headers;
  }

  getCache() {
    return this._cacheHeader;
  }
}
